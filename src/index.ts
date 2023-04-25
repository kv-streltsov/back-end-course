import express, {Response, Request}  from 'express'
import {InterfaceVideo, Resolutions} from "./dto/interface.video";
import {video_list} from "./db/db";
import {videoPostValidator} from "./video/video.post.validator";
import {videoPostCreate} from "./video/video.post.create";
import {videoPutUpdate} from "./video/video.put.update";

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
    videoPutUpdate(req.params.id,req.body)

    res.send(200)
})










if(process.env.NODE_ENV !== 'test'){
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })}
