import express, {Response, Request}  from 'express'
import {InterfaceVideo} from "./dto/interface.video";
import {video_list} from "./db/db";

const app = express()
const port = 3000

app.get('/videos', (req:Request, res:Response) => {
    res.status(200).send(video_list)
})
app.get('/videos/:id', (req:Request, res:Response) => {
    let video:InterfaceVideo | undefined = video_list.find(video  => video.id == parseInt(req.params.id))
    video === undefined ? res.send(404) : res.status(200).send(video)
})




app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})