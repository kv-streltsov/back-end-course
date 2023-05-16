import {Request, Response, Router} from "express";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {InterfacePostView} from "../dto/interface.post";
import {createPostValidation, updatePostValidation} from "../middleware/validation/posts-validation";
import {postsService} from "../domain/post-service";
import {queryPostsRepository} from "../repositories/query-posts-repository";
import {HttpStatusCode} from "../dto/interface.html-code";

export const postRouters = Router({})


postRouters.get('/', async (req: Request, res: Response) => {
    res.status(HttpStatusCode.OK).send(await queryPostsRepository.getAllPosts())
})
postRouters.get('/:id', async (req: Request, res: Response) => {
    const findPost = await queryPostsRepository.getPostById(req.params.id)
    if (findPost !== null) {
        res.status(HttpStatusCode.OK).send(findPost)
    } else res.sendStatus(HttpStatusCode.NOT_FOUND)
})
postRouters.post('/', basic_auth, createPostValidation, async (req: Request, res: Response) => {
    const createdPost: InterfacePostView | undefined = await postsService.postPost(req.body)
    res.status(HttpStatusCode.CREATED).send(createdPost)
})
postRouters.put('/:id', basic_auth, updatePostValidation, async (req: Request, res: Response) => {
    const postPost: boolean | null = await postsService.putPost(req.body, req.params.id)
    if (postPost !== null) {
        res.sendStatus(HttpStatusCode.NO_CONTENT)
    } else res.sendStatus(HttpStatusCode.NOT_FOUND)
})
postRouters.delete('/:id', basic_auth, async (req: Request, res: Response) => {
    const deletePost: boolean | null = await postsService.deletePost(req.params.id)
    if (deletePost !== null) {
        res.sendStatus(HttpStatusCode.NO_CONTENT)
    } else res.sendStatus(HttpStatusCode.NOT_FOUND)

})