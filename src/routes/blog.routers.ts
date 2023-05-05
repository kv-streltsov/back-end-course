import {Request, Response, Router} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {body, validationResult} from 'express-validator'
import {inputValidationMiddleware} from "../middleware/input-validation-middleware";

export const blogRouters = Router({})

const basic_auth = (req: Request, res: Response, next: any) => {
    let header_list: string[] = req.rawHeaders
    //обработать если нет Basic
    header_list.forEach(header => {
        if (header.includes('Basic')) {
            if (header.split(' ')[1] === 'YWRtaW46cXdlcnR5') {
                next()
            } else res.sendStatus(401)
        }
    })
}

blogRouters.get('/', (req: Request, res: Response) => {
    res.status(200).send(blogsRepository.getAllBlogs())
})
blogRouters.get('/:id', (req: Request, res: Response) => {
    const findBlog = blogsRepository.findBlogById(req.params.id)
    if (typeof findBlog !== "number") {
        res.status(200).send(findBlog)
    } else res.sendStatus(404)

})
blogRouters.post('/', basic_auth, inputValidationMiddleware, (req: Request, res: Response) => {
    res.status(200).send(blogsRepository.postBlog(req.body))
})
blogRouters.put('/:id', basic_auth, (req: Request, res: Response) => {
    res.sendStatus(blogsRepository.putBlog(req.body, req.params.id))
})
blogRouters.delete('/:id', basic_auth, (req: Request, res: Response) => {
    res.sendStatus(blogsRepository.deleteBlog(req.params.id))
})