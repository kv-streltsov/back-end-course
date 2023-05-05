import express, {Response, Request} from 'express'
import {videoRouters} from "./routes/video.routers";
import {testingRouter} from "./routes/testing.router";
import {blogRouters} from "./routes/blog.routers";

export const app = express()
const port = 5000

app.use(express.json())

app.use('/videos', videoRouters)
app.use('/blogs',blogRouters)
app.use('/testing/all-data',testingRouter)








if (process.env.NODE_ENV !== 'test') {
	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`)
	})
}