import {Request, Response, Router} from "express";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {QueryCommentRepositoryClass} from "../repositories/query-comment-repository";
import {HttpStatusCode} from "../dto/interface.html-code";
import {createCommentValidation} from "../middleware/validation/comments-validations";
import {RequestWithParams, RequestWithParamsAndBody} from "../dto/interface.request";
import {ILike} from "../dto/interface.like";
import {CommentServiceClass} from "../domain/comment-service";
import {LikeStatusServiceClass} from "../domain/like-status-service";
import {QueryLikeStatusRepositoryClass} from "../repositories/query-like-status-repository";
import {InterfaceError} from "../dto/Interface-error";


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


    async getCommentById(req: RequestWithParams<{
        commentId: string
    }>, res: Response) {
        try {

            const comment = await this.queryCommentRepository.getCommentById(req.params.commentId)
            const likesInfo = await this.queryLikeStatusRepository.getLikesInfo(req.params.commentId, req.user === undefined ? null : req.user)

            if (comment) {
                return res.status(200).send({
                    ...comment,
                    likesInfo: likesInfo
                })
            } else {
                return res.sendStatus(HttpStatusCode.NOT_FOUND)
            }
        }

        catch (error) {
            res.status(500).send(error)
            return
        }

    }

    async putCommentById(req: Request, res: Response) {
       try {
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
       catch (error) {
           res.status(500).send(error)
           return
       }
    }

    async deleteCommentById(req: Request, res: Response) {
        try {

            const result: boolean | string | null = await this.commentService.deleteComment(req.params.id, req.user)

            if (result === 'forbidden') {
                return res.sendStatus(HttpStatusCode.FORBIDDEN)
            }

            if (result === true) {
                return res.sendStatus(HttpStatusCode.NO_CONTENT)
            } else {
                return res.sendStatus(HttpStatusCode.NOT_FOUND)
            }

        } catch (error) {
            res.status(500).send(error)
            return
        }
    }

    async putLikeStatus(req: RequestWithParamsAndBody<{
        commentId: string
    }, ILike>, res: Response) {
        try {

            const result: null | InterfaceError | any = await this.likeStatusService.putLikeStatus(req.user.id, req.params.commentId, req.body.likeStatus)

            if (result === null) {
                res.sendStatus(HttpStatusCode.NOT_FOUND)
                return
            }

            if (result.errorsMessages !== undefined) {
                res.status(HttpStatusCode.BAD_REQUEST).send(result)
                return
            }

            res.sendStatus(204)
        } catch (error) {
            res.status(500).send(error)
        }
    }
}

const commentController = new CommentController()
commentsRouter.get('/:commentId', commentController.getCommentById.bind(commentController))
commentsRouter.put('/:commentId', authMiddleware, createCommentValidation, commentController.putCommentById.bind(commentController))
commentsRouter.put('/:commentId/like-status', authMiddleware, commentController.putLikeStatus.bind(commentController))
commentsRouter.delete('/:id', authMiddleware, commentController.deleteCommentById.bind(commentController))