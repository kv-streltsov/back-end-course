import express, {Response, Request}  from 'express'
import {InterfaceVideo, Resolutions} from "./dto/interface.video";
import {video_list} from "./db/db";
import {videoPostValidator} from "./video/video.post.validator";
import {videoPostCreate} from "./video/video.post.create";
import {videoPutUpdate} from "./video/video.put.update";
import {videoPutValidator} from "./video/video.put.validator";
import {videoDeleteDel} from "./video/video.delete.del";

export const app = express()
const port = 5000










app.use( express.json())
app.get('/',(req,res)=>{
    res.send('Hello')
})

app.get('/videos', (req:Request, res:Response) => {
    res.status(200).send(video_list)
})
app.get('/videos/:id', (req:Request, res:Response) => {

    let video:InterfaceVideo | undefined = video_list.find(video  => video.id === +req.params.id)

    video === undefined ?
        res.send(404) :
        res.status(200).send(video)
})
app.post('/videos',(req: Request,res:Response)=> {

    let valid = videoPostValidator(req.body)

    valid === true ?
        res.status(201).send(videoPostCreate(req.body)):
        res.status(400).send(valid)

})
app.put('/videos/:id',(req: Request,res:Response)=> {
    let valid = videoPutValidator(req.body)

    if(valid === true){
        let upDateVideo = videoPutUpdate(req.params.id, req.body)
        if(upDateVideo) res.send(204)
        else res.send(404)
    }
    else res.status(400).send(valid)


})
app.delete('/videos/:id',(req: Request,res:Response)=>{
    videoDeleteDel(req.params.id) ? res.sendStatus(204) : res.sendStatus(404)
})


app.delete('/testing/all-data',(req: Request,res:Response)=>{
    let video_list: InterfaceVideo[] = []
    res.send(204)
})








if(process.env.NODE_ENV !== 'test'){
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })}
