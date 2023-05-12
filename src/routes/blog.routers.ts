import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {createBlogValidation, updateBlogValidation} from "../middleware/validation/blogs-validations";

export const blogRouters = Router({})


blogRouters.get('/', async (req: Request, res: Response) => {
    res.status(200).send(await blogsRepository.getAllBlogs())
})
blogRouters.get('/:id', async (req: Request, res: Response) => {
    const findBlog = await blogsRepository.findBlogById(req.params.id)
    if (findBlog !== null) {
        res.status(200).send(findBlog)
    } else  res.sendStatus(404)

})
blogRouters.post('/', basic_auth, createBlogValidation, async (req: Request, res: Response) => {

    const createdBlog = await blogsRepository.postBlog(req.body)
    delete createdBlog._id
    res.status(201).send(createdBlog)

})
blogRouters.put('/:id', basic_auth, updateBlogValidation, async (req: Request, res: Response) => {
    const postBlog = await blogsRepository.putBlog(req.body, req.params.id)
    if (postBlog !== null) {
        res.sendStatus(204)
    } else res.sendStatus(404)
})
blogRouters.delete('/:id', basic_auth, async (req: Request, res: Response) => {
    const deleteBlog = await blogsRepository.deleteBlog(req.params.id)
    if (deleteBlog !== null) {
        res.sendStatus(204)
    } else res.sendStatus(404)

})