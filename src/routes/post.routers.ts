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

export const postRouters = Router({})


class PostController {

    private queryCommentRepository: QueryCommentRepositoryClass
    private queryPostsRepository: QueryPostsRepositoryClass
    private commentService: CommentServiceClass
    private queryLikeStatusRepository: QueryLikeStatusRepositoryClass

    constructor() {
        this.queryPostsRepository = new QueryPostsRepositoryClass
        this.queryCommentRepository = new QueryCommentRepositoryClass
        this.commentService = new CommentServiceClass
        this.queryLikeStatusRepository = new QueryLikeStatusRepositoryClass

    }


    // GETs
    async getAllPosts(req: RequestWithQuery<InterfacePaginationQueryParams>, res: Response) {

        const posts = await this.queryPostsRepository.getAllPosts(
            req.query?.pageNumber && Number(req.query.pageNumber),
            req.query?.pageSize && Number(req.query.pageSize),
            req.query?.sortDirection === 'asc' ? SortType.asc : SortType.desc,
            req.query?.sortBy && req.query.sortBy,
        )
        if (posts !== null) {
            res.status(HttpStatusCode.OK).send(posts)
        } else res.sendStatus(HttpStatusCode.NOT_FOUND)
    }

    async getPostById(req: RequestWithParams<InterfaceId>, res: Response) {
        const findPost = await this.queryPostsRepository.getPostById(req.params.id)
        if (findPost !== null) {
            res.status(HttpStatusCode.OK).send(findPost)
        } else res.sendStatus(HttpStatusCode.NOT_FOUND)
    }

    async getCommentsByPostId(req: RequestWithParamsAndQuery<InterfacePostId, InterfacePaginationQueryParams>, res: Response) {
        const comments = await this.queryCommentRepository.getCommentsByPostId(
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

    }

    // POSTs
    async postCommentByPostId(req: Request, res: Response) {

        const comment: IComment | boolean | null = await this.commentService.postComment(req.params.postId, req.user, req.body)

        if (comment) {
            const likesInfo = await this.queryLikeStatusRepository.getLikesInfo(req.user.id, comment.id)

            res.status(201).send({
                ...comment,
                likesInfo: likesInfo
            })

        } else {
            res.sendStatus(HttpStatusCode.NOT_FOUND)
        }

    }

    async postPost(req: RequestWithBody<InterfacePostInput>, res: Response) {
        const createdPost: InterfacePostView | undefined = await postsService.postPost(req.body)
        res.status(HttpStatusCode.CREATED).send(createdPost)
    }

    async putPostById(req: RequestWithParamsAndBody<any, InterfacePostView>, res: Response) {
        const postPost: boolean | null = await postsService.putPost(req.body, req.params.id)
        if (postPost !== null) {
            res.sendStatus(HttpStatusCode.NO_CONTENT)
        } else res.sendStatus(HttpStatusCode.NOT_FOUND)
    }

    async deletePostById(req: RequestWithParams<{ id: string }>, res: Response) {
        const deletePost: boolean | null = await postsService.deletePost(req.params.id)
        if (deletePost !== null) {
            res.sendStatus(HttpStatusCode.NO_CONTENT)
        } else res.sendStatus(HttpStatusCode.NOT_FOUND)

    }
}

const postController = new PostController()
// GET
postRouters.get('/', postController.getAllPosts.bind(postController))
postRouters.get('/:id', postController.getPostById.bind(postController))
postRouters.get('/:postId/comments', postController.getCommentsByPostId.bind(postController))
// POST
postRouters.post('/:postId/comments', authMiddleware, createCommentValidation, postController.postCommentByPostId.bind(postController))
postRouters.post('/', basic_auth, createPostValidation, postController.postPost)
postRouters.put('/:id', basic_auth, updatePostValidation, postController.putPostById)
postRouters.delete('/:id', basic_auth, postController.deletePostById)