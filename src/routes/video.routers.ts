import express, {Response, Request, Router} from 'express'
import {video_list} from "../db/db";
import {InterfaceVideo, RequserWithBody} from "../dto/interface.video";

import {videoValidator} from "../video/video.validator";
import {videoPostCreate} from "../video/video.post.create";
import {videoPutUpdate} from "../video/video.put.update";
import {videoDeleteDel} from "../video/video.delete.del";

export const videoRouters = Router({})
videoRouters.get('/', (req: Request<{}, {}, {}, { name: string }>,
					   res: Response<InterfaceVideo[]>) => {
	res.status(200).send(video_list)
})
videoRouters.get('/:id', (req: Request<{ id: string }, {}, {}, {}>,
						  res: Response<InterfaceVideo | number>) => {
	let video: InterfaceVideo | undefined = video_list.find(video => video.id === +req.params.id)

	if(!video){
		res.send(404)
		return
	}

	res.status(200).send(video)
})
//
videoRouters.post('/', (req: RequserWithBody<InterfaceVideo>, res: Response<InterfaceVideo>) => {

	let valid = videoValidator(req.body, req.method)
	valid === true ?
		res.status(201).send(videoPostCreate(req.body)) :
		res.status(400).send(valid)

})
videoRouters.put('/:id', (req: Request<{ id: string }, {}, InterfaceVideo, {}>,
						  res: Response<number>) => {

	let valid = videoValidator(req.body, req.method)

	if (valid === true) {
		let upDateVideo = videoPutUpdate(req.params.id, req.body)
		if (upDateVideo) res.send(204)
		else res.send(404)
	} else res.status(400).send(valid)


})
videoRouters.delete('/:id', (req: Request, res: Response) => {
	videoDeleteDel(req.params.id) ? res.sendStatus(204) : res.sendStatus(404)
})

