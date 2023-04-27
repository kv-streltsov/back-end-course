import express, {Response, Request, Router} from 'express'
import {video_list} from "../db/db";
import {InterfaceVideo} from "../dto/interface.video";

import {videoValidator} from "../video/video.validator";
import {videoPostCreate} from "../video/video.post.create";
import {videoPutUpdate} from "../video/video.put.update";
import {videoDeleteDel} from "../video/video.delete.del";

export const videoRouters = Router({})

videoRouters.get('/', (req:Request, res:Response) => {
	res.status(200).send(video_list)
})
videoRouters.get('/:id', (req:Request, res:Response) => {
	console.log(typeof req.method)
	let video:InterfaceVideo | undefined = video_list.find(video  => video.id === +req.params.id)

	video === undefined ?
		res.send(404) :
		res.status(200).send(video)
})
videoRouters.post('/',(req: Request,res:Response)=> {

	let valid = videoValidator(req.body, req.method)
	valid === true ?
		res.status(201).send(videoPostCreate(req.body)):
		res.status(400).send(valid)

})
videoRouters.put('/:id',(req: Request,res:Response)=> {

	let valid = videoValidator(req.body, req.method)

	if(valid === true){
		let upDateVideo = videoPutUpdate(req.params.id, req.body)
		if(upDateVideo) res.send(204)
		else res.send(404)
	}
	else res.status(400).send(valid)


})
videoRouters.delete('/:id',(req: Request,res:Response)=>{
	videoDeleteDel(req.params.id) ? res.sendStatus(204) : res.sendStatus(404)
})

