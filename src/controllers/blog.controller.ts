import {QueryBlogsRepositoryClass} from "../repositories/query-blogs-repository";
import {
    InterfaceId,
    RequestWithBody,
    RequestWithParams, RequestWithParamsAndBody,
    RequestWithParamsAndQuery,
    RequestWithQuery
} from "../dto/interface.request";
import {InterfacePaginationQueryParams, SortType} from "../dto/interface.pagination";
import {Request, Response} from "express";
import {InterfaceBlogInput, InterfaceBlogView, InterfaceGetBlogsWitchQuery} from "../dto/interface.blog";
import {HttpStatusCode} from "../dto/interface.html-code";
import {WithId} from "mongodb";
import {InterfacePostInBlog} from "../dto/interface.post";
import  {BlogsServiceClass} from "../domain/blog-service";
import {inject, injectable} from "inversify";

@injectable()
export class BlogController {
    constructor(
      @inject(QueryBlogsRepositoryClass)protected queryBlogsRepository:QueryBlogsRepositoryClass,
      @inject(BlogsServiceClass)protected  blogsService: BlogsServiceClass
    ) {}


    async getAllBlog(req: RequestWithQuery<InterfacePaginationQueryParams>,
                     res: Response<InterfaceGetBlogsWitchQuery>) {
        const blogs = await this.queryBlogsRepository.getAllBlogs(
            req.query?.pageNumber && Number(req.query.pageNumber),
            req.query?.pageSize && Number(req.query.pageSize),
            req.query?.sortDirection === 'asc' ? SortType.asc : SortType.desc,
            req.query?.sortBy && req.query.sortBy,
            req.query?.searchNameTerm && req.query.searchNameTerm)
        res.status(HttpStatusCode.OK).send(blogs)
    }

    async getBlogById(req: RequestWithParams<InterfaceId>,
                      res: Response<WithId<any>>) {
        const findBlog = await this.queryBlogsRepository.getBlogById(req.params.id)

        if (findBlog !== null) {
            res.status(HttpStatusCode.OK).send(findBlog)
        } else res.sendStatus(HttpStatusCode.NOT_FOUND)

    }


    getPostsByiDBlog = async (req: RequestWithParamsAndQuery<InterfaceId, InterfacePaginationQueryParams>,
                           res: Response<WithId<any>>) =>  {
        const posts = await this.queryBlogsRepository.getPostsInBlog
        (
            req.query?.pageNumber && Number(req.query.pageNumber),
            req.query?.pageSize && Number(req.query.pageSize),
            req.query?.sortDirection === 'asc' ? SortType.asc : SortType.desc,
            req.query?.sortBy && req.query.sortBy,
            req.params.id.toString()
        )
        if (posts !== null) {
            res.status(HttpStatusCode.OK).send(posts)
        } else res.sendStatus(HttpStatusCode.NOT_FOUND)
    }

    async postBlog(req: RequestWithBody<InterfaceBlogInput>,
                   res: Response<InterfaceBlogView>) {
        const createdBlog: InterfaceBlogView = await this.blogsService.postBlog(req.body)
        res.status(HttpStatusCode.CREATED).send(createdBlog)

    }

    async postPostByBlogId(req: RequestWithParamsAndBody<{ id: string }, InterfacePostInBlog>,
                           res: Response) {

        const createdBlog = await this.blogsService.postPostInBlog(req.params.id, req.body)
        if (createdBlog === undefined || createdBlog === null) {
            res.sendStatus(HttpStatusCode.NOT_FOUND)
        } else {
            res.status(HttpStatusCode.CREATED).send(createdBlog)
        }

    }

    async putBlog(req: Request, res: Response) {
        const postBlog = await this.blogsService.putBlog(req.body, req.params.id)
        if (postBlog !== null) {
            res.sendStatus(HttpStatusCode.NO_CONTENT)
        } else res.sendStatus(HttpStatusCode.NOT_FOUND)
    }

    async deleteBlog(req: Request, res: Response) {
        const deleteBlog = await this.blogsService.deleteBlog(req.params.id)
        if (deleteBlog !== null) {
            res.sendStatus(HttpStatusCode.NO_CONTENT)
        } else res.sendStatus(HttpStatusCode.NOT_FOUND)

    }

}
