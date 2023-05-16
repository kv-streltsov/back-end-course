import {Request, Response, Router} from "express";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {createBlogValidation, updateBlogValidation} from "../middleware/validation/blogs-validations";
import {InterfaceBlogView} from "../dto/interface.blog";
import {queryBlogsRepository} from "../repositories/query-blogs-repository";
import {blogsService} from "../domain/blog-service";
import {HttpStatusCode} from "../dto/interface.html-code";
import {createPostInBlogValidation, createPostValidation} from "../middleware/validation/posts-validation";

export const blogRouters = Router({})


blogRouters.get('/', async (req: Request, res: Response) => {
    res.status(HttpStatusCode.OK).send(await queryBlogsRepository.getAllBlogs(req.query))
})
blogRouters.get('/:id', async (req: Request, res: Response) => {
    const findBlog = await queryBlogsRepository.getBlogById(req.params.id)
    if (findBlog !== null) {
        res.status(HttpStatusCode.OK).send(findBlog)
    } else res.sendStatus(HttpStatusCode.NOT_FOUND)

})
blogRouters.get('/:id/posts/', async (req: Request, res: Response) => {
    const findBlog = await queryBlogsRepository.getPostsInBlog(req.params.id, req.query)
    if (findBlog !== null) {
        res.status(HttpStatusCode.OK).send(findBlog)
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