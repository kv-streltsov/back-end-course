import express from 'express'
import * as dotenv from 'dotenv'
import {videoRouters} from "./routes/video.routers";
import {testingRouter} from "./routes/testing.router";
import {blogRouters} from "./routes/blog.routers";
import {postRouters} from "./routes/post.routers";
import {clientMongo, runMongo} from "./db/db_mongo";

dotenv.config()
export const app = express()
const port = process.env.DEV_PORT || 5001


app.use(express.json())

app.use('/videos', videoRouters)
app.use('/blogs', blogRouters)
app.use('/posts', postRouters)
app.use('/testing/all-data', testingRouter)


const startApp = async ()=>{
    await runMongo()
    if (process.env.NODE_ENV !== 'test') {
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    }
}
startApp()