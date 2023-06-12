import express from 'express'
import * as dotenv from 'dotenv'
import {testingRouter} from "./routes/testing.router";
import {blogRouters} from "./routes/blog.routers";
import {postRouters} from "./routes/post.routers";
import {collectionRateLimit, runMongo} from "./db/db_mongo";
import {userRouters} from "./routes/user.routers";
import {authRouters} from "./routes/auth.routers";
import {commentsRouter} from "./routes/comments.routers";
import {emailRouters} from "./routes/email.routers";
import cookieParser from "cookie-parser";
import {rateInsertLimitMiddleware} from "./middleware/rate-isert-limit-middleware";
import {securityDevicesRouters} from "./routes/security.devices.routers";

dotenv.config()
export const app = express()
export const MONGO_URL: string | undefined = process.env.MONGO_URL

const port = process.env.DEV_PORT || 5001

app.use(express.json())
app.use(cookieParser())
app.use(rateInsertLimitMiddleware)
app.set('trust proxy', true)


app.use('/blogs', blogRouters)
app.use('/posts', postRouters)
app.use('/users', userRouters)
app.use('/comments', commentsRouter)
app.use('/auth', authRouters)
app.use('/send', emailRouters)
app.use('/security', securityDevicesRouters)


app.use('/testing/all-data', testingRouter)


const startApp = async () => {
	await runMongo()
	if (process.env.NODE_ENV !== 'test') {
		app.listen(port, () => {
			console.log(`Example app listening on port ${port}`)
		})
	}
}
startApp()