import {Request, Response, Router} from "express";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {createBlogValidation, updateBlogValidation} from "../middleware/validation/blogs-validations";
import {InterfaceBlogView} from "../dto/interface.blog";
import {queryBlogsRepository} from "../repositories/query-blogs-repository";
import {blogsService} from "../domain/blog-service";

export const blogRouters = Router({})


blogRouters.get('/', async (req: Request, res: Response) => {
    res.status(200).send(await queryBlogsRepository.getAllBlogs())
})
blogRouters.get('/:id', async (req: Request, res: Response) => {
    const findBlog = await queryBlogsRepository.getBlogById(req.params.id)
    if (findBlog !== null) {
        res.status(200).send(findBlog)
    } else  res.sendStatus(404)

})
blogRouters.post('/', basic_auth, createBlogValidation, async (req: Request, res: Response) => {

    const createdBlog:InterfaceBlogView = await blogsService.postBlog(req.body)
    res.status(201).send(createdBlog)

})
blogRouters.put('/:id', basic_auth, updateBlogValidation, async (req: Request, res: Response) => {
    const postBlog = await blogsService.putBlog(req.body, req.params.id)
    if (postBlog !== null) {
        res.sendStatus(204)
    } else res.sendStatus(404)
})
blogRouters.delete('/:id', basic_auth, async (req: Request, res: Response) => {
    const deleteBlog = await blogsService.deleteBlog(req.params.id)
    if (deleteBlog !== null) {
        res.sendStatus(204)
    } else res.sendStatus(404)

})