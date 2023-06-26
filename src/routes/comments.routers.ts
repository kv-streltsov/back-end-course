import {Request, Response, Router} from "express";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {QueryCommentRepositoryClass} from "../repositories/query-comment-repository";
import {HttpStatusCode} from "../dto/interface.html-code";
import {createCommentValidation} from "../middleware/validation/comments-validations";
import {RequestWithParams, RequestWithParamsAndBody} from "../dto/interface.request";
import {ICommentId} from "../dto/interface.comment";
import {ILike} from "../dto/interface.like";
import {CommentServiceClass} from "../domain/comment-service";
import {LikeStatusServiceClass} from "../domain/like-status-service";
import {QueryLikeStatusRepositoryClass} from "../repositories/query-like-status-repository";


export const commentsRouter = Router({})

class CommentController {

    private queryCommentRepository: QueryCommentRepositoryClass
    private commentService: CommentServiceClass
    private likeStatusService: LikeStatusServiceClass
    private queryLikeStatusRepository: QueryLikeStatusRepositoryClass

    constructor() {
        this.queryCommentRepository = new QueryCommentRepositoryClass
        this.commentService = new CommentServiceClass
        this.likeStatusService = new LikeStatusServiceClass
        this.queryLikeStatusRepository = new QueryLikeStatusRepositoryClass()
    }


    async getCommentById(req: RequestWithParams<{ commentId: string }>, res: Response) {
        const comment = await this.queryCommentRepository.getCommentById(req.params.commentId)
        const likeStatus = await this.queryLikeStatusRepository.findLikeStatusByUserId(req.user.id)
        const likesCount = await this.queryLikeStatusRepository.getLikesCount(req.params.commentId)
        const dislikesCount = await this.queryLikeStatusRepository.getDislikesCount(req.params.commentId)

        if (comment) {
            return res.status(200).send({
                ...comment,
                likesInfo : {
                    myStatus: likeStatus,
                    likesCount: likesCount,
                    dislikesCount: dislikesCount
                }
            })
        } else {
            return res.sendStatus(HttpStatusCode.NOT_FOUND)
        }
    }

    async putCommentById(req: Request, res: Response) {
        const result: boolean | string | null = await this.commentService.putComment(req.params.id, req.user, req.body)
        if (result === 'forbidden') {
            return res.sendStatus(HttpStatusCode.FORBIDDEN)
        }
        if (result === true) {
            return res.sendStatus(HttpStatusCode.NO_CONTENT)
        } else {
            return res.sendStatus(HttpStatusCode.NOT_FOUND)
        }
    }

    async deleteCommentById(req: Request, res: Response) {
        const result: boolean | string | null = await this.commentService.deleteComment(req.params.id, req.user)
        if (result === 'forbidden') {
            return res.sendStatus(HttpStatusCode.FORBIDDEN)
        }
        if (result === true) {
            return res.sendStatus(HttpStatusCode.NO_CONTENT)
        } else {
            return res.sendStatus(HttpStatusCode.NOT_FOUND)
        }
    }

    async putLikeStatus(req: RequestWithParamsAndBody<{ commentId: string }, ILike>, res: Response) {
        await this.likeStatusService.putLikeStatus(req.user.id, req.params.commentId, req.body.likeStatus)
        res.sendStatus(204)
    }
}

const commentController = new CommentController()
commentsRouter.get('/:commentId', authMiddleware, commentController.getCommentById.bind(commentController))
commentsRouter.put('/:commentId', authMiddleware, createCommentValidation, commentController.putCommentById.bind(commentController))
commentsRouter.put('/:commentId/like-status', authMiddleware, commentController.putLikeStatus.bind(commentController))
commentsRouter.delete('/:id', authMiddleware, commentController.deleteCommentById.bind(commentController))