import {Router} from "express";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {createPostValidation, updatePostValidation} from "../middleware/validation/posts-validation";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {createCommentValidation} from "../middleware/validation/comments-validations";
import {container} from "../composition.root";
import {PostController} from "../controllers/post.controller";

export const postRouters = Router({})
const postController = container.resolve(PostController)
// GET
postRouters.get('/', postController.getAllPosts.bind(postController))
postRouters.get('/:id', postController.getPostById.bind(postController))
postRouters.get('/:postId/comments', postController.getCommentsByPostId.bind(postController))
// POST
postRouters.post('/:postId/comments', authMiddleware, createCommentValidation, postController.postCommentByPostId.bind(postController))
postRouters.post('/', basic_auth, createPostValidation, postController.postPost.bind(postController))
postRouters.put('/:id', basic_auth, updatePostValidation, postController.putPostById.bind(postController))
postRouters.delete('/:id', basic_auth, postController.deletePostById.bind(postController))