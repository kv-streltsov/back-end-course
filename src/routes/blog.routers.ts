import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {InterfaceBlog} from "../dto/interface.blog";
import {createBlogValidation} from "../middleware/validation/blogs-validations";

export const blogRouters = Router({})


blogRouters.get('/', (req: Request, res: Response) => {
    res.status(200).send(blogsRepository.getAllBlogs())
})
blogRouters.get('/:id', (req: Request, res: Response) => {
    const findBlog: number | InterfaceBlog = blogsRepository.findBlogById(req.params.id)
    if (typeof findBlog !== "number") {
        res.status(200).send(findBlog)
    } else res.sendStatus(404)

})
blogRouters.post('/', basic_auth, createBlogValidation, (req: Request, res: Response) => {
    const newBlog:InterfaceBlog = blogsRepository.postBlog(req.body)
    res.status(201).send(newBlog)
})
blogRouters.put('/:id', basic_auth, createBlogValidation, (req: Request, res: Response) => {
    res.sendStatus(blogsRepository.putBlog(req.body, req.params.id))
})
blogRouters.delete('/:id', basic_auth, (req: Request, res: Response) => {
    res.sendStatus(blogsRepository.deleteBlog(req.params.id))
})