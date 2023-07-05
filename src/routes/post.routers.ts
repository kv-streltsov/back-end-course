import {Request, Response, Router} from "express";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {InterfacePostInput, InterfacePostView} from "../dto/interface.post";
import {createPostValidation, updatePostValidation} from "../middleware/validation/posts-validation";
import {postsService} from "../domain/post-service";
import {HttpStatusCode} from "../dto/interface.html-code";
import {InterfacePaginationQueryParams, SortType} from "../dto/interface.pagination";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {createCommentValidation} from "../middleware/validation/comments-validations";
import {
    InterfaceId,
    InterfacePostId, RequestWithBody,
    RequestWithParams, RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery,
} from "../dto/interface.request";
import {QueryPostsRepositoryClass} from "../repositories/query-posts-repository";
import {QueryCommentRepositoryClass} from "../repositories/query-comment-repository";
import {CommentServiceClass} from "../domain/comment-service";
import {QueryLikeStatusRepositoryClass} from "../repositories/query-like-status-repository";
import {IComment, ICommentDb} from "../dto/interface.comment";
import {postController} from "../composition.root";

export const postRouters = Router({})




// GET
postRouters.get('/', postController.getAllPosts.bind(postController))
postRouters.get('/:id', postController.getPostById.bind(postController))
postRouters.get('/:postId/comments', postController.getCommentsByPostId.bind(postController))
// POST
postRouters.post('/:postId/comments', authMiddleware, createCommentValidation, postController.postCommentByPostId.bind(postController))
postRouters.post('/', basic_auth, createPostValidation, postController.postPost.bind(postController))
postRouters.put('/:id', basic_auth, updatePostValidation, postController.putPostById.bind(postController))
postRouters.delete('/:id', basic_auth, postController.deletePostById.bind(postController))