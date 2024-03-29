import   express from 'express' 
import * as dotenv from 'dotenv'
import {testingRouter} from "./routes/testing.router";
import {blogRouters} from "./routes/blog.routers";
import {postRouters} from "./routes/post.routers";
import {runMongo} from "./db/db_mongo";
import {userRouters} from "./routes/user.routers";
import {authRouters} from "./routes/auth.routers";
import {commentsRouter} from "./routes/comments.routers";
import cookieParser from "cookie-parser";
import {securityDevicesRouters} from "./routes/security.devices.routers";
import {auth} from "./middleware/auth-middleware";

dotenv.config()
export const app = express()
const port = process.env.DEV_PORT || 5001

app.use(express.json())
app.use(cookieParser())
app.use(auth)
app.set('trust proxy', true)


app.use('/blogs', blogRouters)
app.use('/posts', postRouters)
app.use('/users', userRouters)
app.use('/comments', commentsRouter)
app.use('/auth', authRouters)
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