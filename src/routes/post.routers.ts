import {Request, Response, Router} from "express";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {InterfacePostView} from "../dto/interface.post";
import {createPostValidation, updatePostValidation} from "../middleware/validation/posts-validation";
import {postsService} from "../domain/post-service";
import {queryPostsRepository} from "../repositories/query-posts-repository";

export const postRouters = Router({})


postRouters.get('/', async (req: Request, res: Response) => {
    res.status(200).send(await queryPostsRepository.getAllPosts())
})
postRouters.get('/:id', async (req: Request, res: Response) => {
    const findPost = await queryPostsRepository.getPostById(req.params.id)
    if (findPost !== null) {
        res.status(200).send(findPost)
    } else res.sendStatus(404)
})
postRouters.post('/', basic_auth, createPostValidation, async (req: Request, res: Response) => {
    const createdPost: InterfacePostView | undefined = await postsService.postPost(req.body)
    res.status(201).send(createdPost)
})
postRouters.put('/:id', basic_auth, updatePostValidation, async (req: Request, res: Response) => {
    const postPost: boolean | null = await postsService.putPost(req.body, req.params.id)
    if (postPost !== null) {
        res.sendStatus(204)
    } else res.sendStatus(404)
})
postRouters.delete('/:id', basic_auth, async (req: Request, res: Response) => {
    const deletePost: boolean | null = await postsService.deletePost(req.params.id)
    if (deletePost !== null) {
        res.sendStatus(204)
    } else res.sendStatus(404)

})