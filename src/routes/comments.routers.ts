import {Request, Response, Router} from "express";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {QueryCommentRepositoryClass} from "../repositories/query-comment-repository";
import {HttpStatusCode} from "../dto/interface.html-code";
import {commentService} from "../domain/comment-service";
import {createCommentValidation} from "../middleware/validation/comments-validations";
import {RequestWithParams} from "../dto/interface.request";
import {ICommentId} from "../dto/interface.comment";


export const commentsRouter = Router({})

class CommentController {

    private queryCommentRepository: QueryCommentRepositoryClass

    constructor() {
        this.queryCommentRepository = new QueryCommentRepositoryClass
    }


    async getCommentById(req: RequestWithParams<ICommentId>, res: Response) {
        const comment = await this.queryCommentRepository.getCommentById(req.params.commendId)
        if (comment) {
            return res.status(200).send(comment)
        } else {
            return res.sendStatus(HttpStatusCode.NOT_FOUND)
        }
    }

    async putCommentById(req: Request, res: Response) {
        const result: boolean | string | null = await commentService.putComment(req.params.id, req.user, req.body)
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
        const result: boolean | string | null = await commentService.deleteComment(req.params.id, req.user)
        if (result === 'forbidden') {
            return res.sendStatus(HttpStatusCode.FORBIDDEN)
        }
        if (result === true) {
            return res.sendStatus(HttpStatusCode.NO_CONTENT)
        } else {
            return res.sendStatus(HttpStatusCode.NOT_FOUND)
        }
    }
}

const commentController = new CommentController()
commentsRouter.get('/:id', commentController.getCommentById)
commentsRouter.put('/:id', authMiddleware, createCommentValidation, commentController.putCommentById)
commentsRouter.delete('/:id', authMiddleware, commentController.deleteCommentById)