import express, {Response, Request, Router} from 'express'
import {video_list} from "../db/db";
import {InterfaceVideo, RequserWithBody} from "../dto/interface.video";

import {videoValidator} from "../video/video.validator";
import {videoPostCreate} from "../video/video.post.create";
import {videoPutUpdate} from "../video/video.put.update";
import {videoDeleteDel} from "../video/video.delete.del";
import {videoRepository} from "../repositories/video-repository";

export const videoRouters = Router({})
videoRouters.get('/', (req: Request<{}, {}, {}, { name: string }>, res: Response<InterfaceVideo[]>) => {
	let video = videoRepository.getAllVideo()
	res.status(200).send(video)
})
videoRouters.get('/:id', (req: Request<{ id: string }, {}, {}, {}>, res: Response<InterfaceVideo | number>) => {

	let findVideo = videoRepository.findVideoById(req.params.id)
	if(findVideo === 404) res.sendStatus(404)
	res.status(200).send(findVideo)

})
//
videoRouters.post('/', (req: RequserWithBody<InterfaceVideo>, res: Response<InterfaceVideo>) => {
	let newVideo = videoRepository.postVideo(req.body,req.method)
	if(newVideo === 400) res.sendStatus(400)
	res.status(201).send(newVideo)
})
videoRouters.put('/:id', (req: Request<{ id: string }, {}, InterfaceVideo, {}>,  res: Response<number>) => {
	let putVideo = videoRepository.putVideo(req.params.id,req.body,req.method)

	if(putVideo === 204) res.sendStatus(204)
	if(putVideo === 404) res.sendStatus(404)
	else res.status(400).send(putVideo)

})
videoRouters.delete('/:id', (req: Request, res: Response) => {
	let delVideo = videoRepository.deleteVideo(req.params.id)
	if(delVideo === 204) res.sendStatus(204)
	else res.sendStatus(404)

})

