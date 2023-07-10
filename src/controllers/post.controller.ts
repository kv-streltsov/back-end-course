import {QueryCommentRepositoryClass} from "../repositories/query-comment-repository";
import {QueryPostsRepositoryClass} from "../repositories/query-posts-repository";
import {CommentServiceClass} from "../domain/comment-service";
import {QueryLikeStatusRepositoryClass} from "../repositories/query-like-status-repository";
import {
    InterfaceId,
    InterfacePostId, RequestWithBody,
    RequestWithParams, RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../dto/interface.request";
import {InterfacePaginationQueryParams, SortType} from "../dto/interface.pagination";
import {Request, Response} from "express";
import {HttpStatusCode} from "../dto/interface.html-code";
import {IComment} from "../dto/interface.comment";
import {InterfacePostInput, InterfacePostView} from "../dto/interface.post";
import {PostsServiceClass} from "../domain/post-service";
import {inject, injectable} from "inversify";
@injectable()
export class PostController {
    constructor(
        @inject(QueryCommentRepositoryClass)protected queryCommentRepository: QueryCommentRepositoryClass,
        @inject(QueryPostsRepositoryClass)protected queryPostsRepository: QueryPostsRepositoryClass,
        @inject(CommentServiceClass)protected commentService: CommentServiceClass,
        @inject(QueryLikeStatusRepositoryClass)protected queryLikeStatusRepository: QueryLikeStatusRepositoryClass,
        @inject(PostsServiceClass)protected postsService: PostsServiceClass
    ) {
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
        const createdPost: InterfacePostView | undefined = await this.postsService.postPost(req.body)
        res.status(HttpStatusCode.CREATED).send(createdPost)
    }

    async putPostById(req: RequestWithParamsAndBody<any, InterfacePostView>, res: Response) {
        const postPost: boolean | null = await this.postsService.putPost(req.body, req.params.id)
        if (postPost !== null) {
            res.sendStatus(HttpStatusCode.NO_CONTENT)
        } else res.sendStatus(HttpStatusCode.NOT_FOUND)
    }

    async deletePostById(req: RequestWithParams<{ id: string }>, res: Response) {
        const deletePost: boolean | null = await this.postsService.deletePost(req.params.id)
        if (deletePost !== null) {
            res.sendStatus(HttpStatusCode.NO_CONTENT)
        } else res.sendStatus(HttpStatusCode.NOT_FOUND)

    }
}