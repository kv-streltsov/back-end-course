import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {body, validationResult} from 'express-validator'
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {InterfaceBlog} from "../dto/interface.blog";

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
blogRouters.post('/', basic_auth, inputValidationMiddleware, (req: Request, res: Response) => {
    res.status(201).send(blogsRepository.postBlog(req.body))
})
blogRouters.put('/:id', basic_auth, (req: Request, res: Response) => {
    res.sendStatus(blogsRepository.putBlog(req.body, req.params.id))
})
blogRouters.delete('/:id', basic_auth, (req: Request, res: Response) => {
    res.sendStatus(blogsRepository.deleteBlog(req.params.id))
})