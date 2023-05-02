import express, {Response, Request} from 'express'
import {videoRouters} from "./routes/video.routers";

export const app = express()
const port = 5000

app.use(express.json())
app.use('/videos', videoRouters)




















if (process.env.NODE_ENV !== 'test') {
	app.listen(port, () => {
		console.log(`Example app listening on port ${port}`)
	})
}