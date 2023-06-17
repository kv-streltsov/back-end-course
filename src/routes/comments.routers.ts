import {Request, Response, Router} from "express";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {queryCommentRepository} from "../repositories/query-comment-repository";
import {HttpStatusCode} from "../dto/interface.html-code";
import {commentService} from "../domain/comment-service";
import {createCommentValidation} from "../middleware/validation/comments-validations";
import {RequestWithParams} from "../dto/interface.request";
import {ICommentId} from "../dto/interface.comment";


export const commentsRouter = Router({})


commentsRouter.get('/:id', async (req: RequestWithParams<ICommentId>, res: Response) => {
    const comment = await queryCommentRepository.getCommentById(req.params.commendId)
    if (comment) {
        return res.status(200).send(comment)
    } else {
        return res.sendStatus(HttpStatusCode.NOT_FOUND)
    }
})
commentsRouter.put('/:id', authMiddleware, createCommentValidation, async (req: Request, res: Response) => {
    const result: boolean | string | null = await commentService.putComment(req.params.id, req.user, req.body)
    if (result === 'forbidden') {
        return res.sendStatus(HttpStatusCode.FORBIDDEN)
    }
    if (result === true) {
        return res.sendStatus(HttpStatusCode.NO_CONTENT)
    } else {
        return res.sendStatus(HttpStatusCode.NOT_FOUND)
    }
})
commentsRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const result: boolean | string | null = await commentService.deleteComment(req.params.id, req.user)
    if (result === 'forbidden') {
        return res.sendStatus(HttpStatusCode.FORBIDDEN)
    }
    if (result === true) {
        return res.sendStatus(HttpStatusCode.NO_CONTENT)
    } else {
        return res.sendStatus(HttpStatusCode.NOT_FOUND)
    }
})