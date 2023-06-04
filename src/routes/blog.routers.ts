import {Request, Response, Router} from "express";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {createBlogValidation, updateBlogValidation} from "../middleware/validation/blogs-validations";
import {InterfaceBlogInput, InterfaceBlogView, InterfaceGetBlogsWitchQuery} from "../dto/interface.blog";
import {queryBlogsRepository} from "../repositories/query-blogs-repository";
import {blogsService} from "../domain/blog-service";
import {HttpStatusCode} from "../dto/interface.html-code";
import {createPostInBlogValidation} from "../middleware/validation/posts-validation";
import {InterfacePaginationQueryParams, SortType} from "../dto/interface.pagination";
import {
    InterfaceId,
    RequestWithBody,
    RequestWithParams, RequestWithParamsAndBody, RequestWithParamsAndQuery,
    RequestWithQuery,
} from "../dto/interface.request";
import {WithId} from "mongodb";

export const blogRouters = Router({})


blogRouters.get('/', async (req: RequestWithQuery<InterfacePaginationQueryParams>,
                            res: Response<InterfaceGetBlogsWitchQuery>) => {
    const blogs = await queryBlogsRepository.getAllBlogs(
        req.query?.pageNumber && Number(req.query.pageNumber),
        req.query?.pageSize && Number(req.query.pageSize),
        req.query?.sortDirection === 'asc' ? SortType.asc : SortType.desc,
        req.query?.sortBy && req.query.sortBy,
        req.query?.searchNameTerm && req.query.searchNameTerm)
    res.status(HttpStatusCode.OK).send(blogs)
})
blogRouters.get('/:id', async (req: RequestWithParams<InterfaceId>,
                               res: Response<WithId<any>>) => {
    const findBlog = await queryBlogsRepository.getBlogById(req.params.id)
    if (findBlog !== null) {
        res.status(HttpStatusCode.OK).send(findBlog)
    } else res.sendStatus(HttpStatusCode.NOT_FOUND)

})
blogRouters.get('/:id/posts/', async (req: RequestWithParamsAndQuery<InterfaceId, InterfacePaginationQueryParams>,
                                      res: Response<WithId<any>>) => {
    const posts = await queryBlogsRepository.getPostsInBlog
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
})

blogRouters.post('/', basic_auth, createBlogValidation, async (req: RequestWithBody<InterfaceBlogInput>,
                                                               res: Response<InterfaceBlogView>) => {
    const createdBlog: InterfaceBlogView = await blogsService.postBlog(req.body)
    res.status(HttpStatusCode.CREATED).send(createdBlog)

});
blogRouters.post('/:id/posts/', basic_auth, createPostInBlogValidation, async (req: Request,
                                                                               res: Response) => {

    const createdBlog = await blogsService.postPostInBlog(req.params.id, req.body)
    if (createdBlog === undefined || createdBlog === null) {
        res.sendStatus(HttpStatusCode.NOT_FOUND)
    } else {
        res.status(HttpStatusCode.CREATED).send(createdBlog)
    }

});
blogRouters.put('/:id', basic_auth, updateBlogValidation, async (req: Request, res: Response) => {
    const postBlog = await blogsService.putBlog(req.body, req.params.id)
    if (postBlog !== null) {
        res.sendStatus(HttpStatusCode.NO_CONTENT)
    } else res.sendStatus(HttpStatusCode.NOT_FOUND)
})
blogRouters.delete('/:id', basic_auth, async (req: Request, res: Response) => {
    const deleteBlog = await blogsService.deleteBlog(req.params.id)
    if (deleteBlog !== null) {
        res.sendStatus(HttpStatusCode.NO_CONTENT)
    } else res.sendStatus(HttpStatusCode.NOT_FOUND)

})