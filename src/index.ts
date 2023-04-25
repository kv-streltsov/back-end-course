import express, {Response, Request}  from 'express'
import {InterfaceVideo, Resolutions} from "./dto/interface.video";
import {video_list} from "./db/db";
import {videoPostValidator} from "./video.post.validator";

export const app = express()
const port = 3000

app.use( express.json())

app.get('/videos', (req:Request, res:Response) => {
    res.status(200).send(video_list)
})
app.get('/videos/:id', (req:Request, res:Response) => {
    let video:InterfaceVideo | undefined = video_list.find(video  => video.id === +req.params.id)
    video === undefined ? res.send(404) : res.status(200).send(video)
})
app.post('/videos',(req: Request,res:Response)=> {

    let valid = videoPostValidator(req.body)
    if(valid) res.status(400).send(valid)

    else {
        let newVideo: InterfaceVideo = {
            id: video_list.length + 1,
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: false,
            minAgeRestriction:18,
            createdAt: new Date().toISOString(),
            publicationDate:new Date().toISOString(),
        }
        console.log(newVideo)

    }

})









if(process.env.NODE_ENV !== 'test'){
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })}
