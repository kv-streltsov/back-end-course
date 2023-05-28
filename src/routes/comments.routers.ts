import {Request, Response, Router} from "express";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {queryCommentRepository} from "../repositories/query-comment-repository";
import {HttpStatusCode} from "../dto/interface.html-code";
import {commentService} from "../domain/comment-service";
import {createCommentValidation} from "../middleware/validation/comments-validations";


export const postComments = Router({})


postComments.get('/:id', async (req: Request, res: Response) => {
    const comment = await queryCommentRepository.getCommentById(req.params.id)
    if (comment) {
        res.status(200).send(comment)
    } else {
        res.sendStatus(HttpStatusCode.NOT_FOUND)
    }
})
postComments.put('/:id', authMiddleware, createCommentValidation, async (req: Request, res: Response) => {
    const result: boolean | string | null = await commentService.putComment(req.params.id, req.user, req.body)
    if (result === 'forbidden') {
        res.sendStatus(HttpStatusCode.FORBIDDEN)
    }
    if (result === true) {
        res.sendStatus(HttpStatusCode.NO_CONTENT)
    } else {
        res.sendStatus(HttpStatusCode.NOT_FOUND)
    }
})
postComments.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const result: boolean | string | null = await commentService.deleteComment(req.params.id, req.user)
    if (result === 'forbidden') {
        res.sendStatus(HttpStatusCode.FORBIDDEN)
    }
    if (result === true) {
        res.sendStatus(HttpStatusCode.NO_CONTENT)
    } else {
        res.sendStatus(HttpStatusCode.NOT_FOUND)
    }
})