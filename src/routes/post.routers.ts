import {Request, Response, Router} from "express";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {postsRepository} from "../repositories/posts-repository";
import {InterfacePost} from "../dto/interface.post";
import {createPostValidation, updatePostValidation} from "../middleware/validation/posts-validation";

export const postRouters = Router({})


postRouters.get('/', (req: Request, res: Response) => {
    res.status(200).send(postsRepository.getAllPosts())
})
postRouters.get('/:id', (req: Request, res: Response) => {

    let findPost: number | InterfacePost = postsRepository.getPostById(req.params.id)
    if (typeof findPost !== "number") {
        res.status(200).send(findPost)
    } else res.sendStatus(404)

})
postRouters.post('/', basic_auth,createPostValidation,  (req: Request, res: Response) => {

    const newPost: InterfacePost = postsRepository.postPost(req.body)
    res.status(201).send(newPost)

})
postRouters.put('/:id', basic_auth, updatePostValidation, (req: Request, res: Response) => {

})
postRouters.delete('/:id', basic_auth, (req: Request, res: Response) => {
})