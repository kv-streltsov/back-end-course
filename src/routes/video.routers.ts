import {Response, Request, Router} from 'express'
import {InterfaceVideo, RequserWithBody} from "../dto/interface.video";


import {videoRepository} from "../repositories/video-repository";
import {basic_auth} from "../middleware/basic-auth-middleware";

export const videoRouters = Router({})
videoRouters.get('/', (req: Request<{}, {}, {}, { name: string }>, res: Response<InterfaceVideo[]>) => {
    let video: InterfaceVideo[] = videoRepository.getAllVideo()
    res.status(200).send(video)
})
videoRouters.get('/:id', (req: Request<{ id: string }, {}, {}, {}>, res: Response<InterfaceVideo | number>) => {
    let findVideo: InterfaceVideo | number = videoRepository.findVideoById(req.params.id)
    if (findVideo === 404) res.sendStatus(404)
    res.status(200).send(findVideo)
})
//
videoRouters.post('/', basic_auth, (req: RequserWithBody<InterfaceVideo>, res: Response<InterfaceVideo>) => {
    let newVideo: any = videoRepository.postVideo(req.body, req.method)
    if (newVideo.errorsMessages !== undefined) res.status(400).send(newVideo)
    else res.status(201).send(newVideo)
})
videoRouters.put('/:id', basic_auth, (req: Request<{ id: string }, {}, InterfaceVideo, {}>, res: Response<number>) => {
    let putVideo = videoRepository.putVideo(req.params.id, req.body, req.method)

    if (putVideo === 204) res.sendStatus(204)
    if (putVideo === 404) res.sendStatus(404)
    else res.status(400).send(putVideo)

})
videoRouters.delete('/:id', basic_auth, (req: Request, res: Response) => {
    res.sendStatus(videoRepository.deleteVideo(req.params.id))
})

