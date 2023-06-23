import {Request, Response, Router} from "express";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {InterfacePostInput, InterfacePostView} from "../dto/interface.post";
import {createPostValidation, updatePostValidation} from "../middleware/validation/posts-validation";
import {postsService} from "../domain/post-service";
import {queryPostsRepository} from "../repositories/query-posts-repository";
import {HttpStatusCode} from "../dto/interface.html-code";
import {InterfacePaginationQueryParams, SortType} from "../dto/interface.pagination";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {commentService} from "../domain/comment-service";
import {createCommentValidation} from "../middleware/validation/comments-validations";
import {queryCommentRepository} from "../repositories/query-comment-repository";
import {
    InterfaceId,
    InterfacePostId, RequestWithBody,
    RequestWithParams, RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery,
} from "../dto/interface.request";

export const postRouters = Router({})







postRouters.get('/', async (req: RequestWithQuery<InterfacePaginationQueryParams>, res: Response) => {

    const posts = await queryPostsRepository.getAllPosts(
        req.query?.pageNumber && Number(req.query.pageNumber),
        req.query?.pageSize && Number(req.query.pageSize),
        req.query?.sortDirection === 'asc' ? SortType.asc : SortType.desc,
        req.query?.sortBy && req.query.sortBy,
    )
    if (posts !== null) {
        res.status(HttpStatusCode.OK).send(posts)
    } else res.sendStatus(HttpStatusCode.NOT_FOUND)
})
postRouters.get('/:id', async (req: RequestWithParams<InterfaceId>, res: Response) => {
    const findPost = await queryPostsRepository.getPostById(req.params.id)
    if (findPost !== null) {
        res.status(HttpStatusCode.OK).send(findPost)
    } else res.sendStatus(HttpStatusCode.NOT_FOUND)
})
postRouters.get('/:postId/comments', async (req: RequestWithParamsAndQuery<InterfacePostId, InterfacePaginationQueryParams>, res: Response) => {
    const comments = await queryCommentRepository.getCommentsByPostId(
        req.params.postId,
        req.query?.pageNumber && Number(req.query.pageNumber),
        req.query?.pageSize && Number(req.query.pageSize),
        req.query?.sortDirection === 'asc' ? SortType.asc : SortType.desc,
        req.query?.sortBy && req.query.sortBy,
    )

    if (comments !== null) {
        res.status(HttpStatusCode.OK).send(comments)
    } else {
        res.sendStatus(HttpStatusCode.NOT_FOUND)
    }

})

postRouters.post('/:postId/comments', authMiddleware, createCommentValidation, async (req: Request, res: Response) => {
    const createdComment = await commentService.postComment(req.params.postId, req.user, req.body)
    if (createdComment) {
        res.status(201).send(createdComment)
    } else {
        res.sendStatus(HttpStatusCode.NOT_FOUND)
    }

})
postRouters.post('/', basic_auth, createPostValidation, async (req: RequestWithBody<InterfacePostInput>, res: Response) => {
    const createdPost: InterfacePostView | undefined = await postsService.postPost(req.body)
    res.status(HttpStatusCode.CREATED).send(createdPost)
})
postRouters.put('/:id', basic_auth, updatePostValidation, async (req: RequestWithParamsAndBody<any, InterfacePostView>, res: Response) => {
    const postPost: boolean | null = await postsService.putPost(req.body, req.params.id)
    if (postPost !== null) {
        res.sendStatus(HttpStatusCode.NO_CONTENT)
    } else res.sendStatus(HttpStatusCode.NOT_FOUND)
})
postRouters.delete('/:id', basic_auth, async (req: RequestWithParams<{id:string}>, res: Response) => {
    const deletePost: boolean | null = await postsService.deletePost(req.params.id)
    if (deletePost !== null) {
        res.sendStatus(HttpStatusCode.NO_CONTENT)
    } else res.sendStatus(HttpStatusCode.NOT_FOUND)

})