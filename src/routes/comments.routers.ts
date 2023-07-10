import {Router} from "express";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {createCommentValidation} from "../middleware/validation/comments-validations";
import {container} from "../composition.root";
import {CommentController} from "../controllers/comment.controller";

export const commentsRouter = Router({})
const commentController = container.resolve(CommentController)

commentsRouter.get('/:commentId', commentController.getCommentById.bind(commentController))
commentsRouter.put('/:commentId', authMiddleware, createCommentValidation, commentController.putCommentById.bind(commentController))
commentsRouter.put('/:commentId/like-status', authMiddleware, commentController.putLikeStatus.bind(commentController))
commentsRouter.delete('/:id', authMiddleware, commentController.deleteCommentById.bind(commentController))