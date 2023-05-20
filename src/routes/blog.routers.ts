import {Request, Response, Router} from "express";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {createBlogValidation, updateBlogValidation} from "../middleware/validation/blogs-validations";
import {InterfaceBlogView} from "../dto/interface.blog";
import {queryBlogsRepository} from "../repositories/query-blogs-repository";
import {blogsService} from "../domain/blog-service";
import {HttpStatusCode} from "../dto/interface.html-code";
import {createPostInBlogValidation, createPostValidation} from "../middleware/validation/posts-validation";
import {queryPostsRepository} from "../repositories/query-posts-repository";

export const blogRouters = Router({})

export type PaginationQueryParamsType = {
    pageNumber?: number,
    pageSize?: number,
    sortDirectioen?: string,
    sortBy?: string,
    searchNameTerm?: string

}

enum SortType {
    ask = 1,
    desc = -1
}

blogRouters.get('/', async (req: Request<any, any, any, PaginationQueryParamsType>, res: Response) => {
    const blogs = await queryBlogsRepository.getAllBlogs(
        req.query?.pageNumber && Number(req.query.pageNumber),
        req.query?.pageSize && Number(req.query.pageSize),
        req.query?.sortDirectioen === 'ask' ? SortType.ask : SortType.desc,
        req.query?.sortBy && req.query.sortBy,
        req.query?.searchNameTerm && req.query.searchNameTerm)

    res.status(HttpStatusCode.OK).send(blogs)
})
blogRouters.get('/:id', async (req: Request, res: Response) => {
    const findBlog = await queryBlogsRepository.getBlogById(req.params.id)
    if (findBlog !== null) {
        res.status(HttpStatusCode.OK).send(findBlog)
    } else res.sendStatus(HttpStatusCode.NOT_FOUND)

})
blogRouters.get('/:id/posts/', async (req:Request, res: Response) => {

    const posts = await queryPostsRepository.getAllPosts(Number(req.query.pageNumber), Number(req.query.pageSize), req.query.sortBy, req.query.sortDirection)

    if (posts !== null) {
        res.status(HttpStatusCode.OK).send(posts)
    } else res.sendStatus(HttpStatusCode.NOT_FOUND)
})


blogRouters.post('/', basic_auth, createBlogValidation, async (req: Request, res: Response) => {

    const createdBlog: InterfaceBlogView = await blogsService.postBlog(req.body)
    res.status(HttpStatusCode.CREATED).send(createdBlog)

});
blogRouters.post('/:id/posts/', basic_auth, createPostInBlogValidation, async (req: Request, res: Response) => {

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