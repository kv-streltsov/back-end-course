import * as dotenv from 'dotenv'
import mongoose from "mongoose";
import {devicesSessionsModel} from "./schemes/devices.sessions.scheme";
import {rateLimitModel} from "./schemes/rate.limit.scheme";
import {commentsModel} from "./schemes/comments.scheme";
import {usersModel} from "./schemes/users.scheme";
import {postsModel} from "./schemes/posts.scheme";
import {blogsModel} from "./schemes/blogs.scheme";


dotenv.config()
export const MONGO_URL: string | undefined = process.env.MONGO_URL
export const MONGOOSE_URL: string | undefined  = process.env.MONGOOSE_URL

if (!MONGO_URL  ) {
    throw new Error('!!! Bad URL')
}

export async function runMongo() {

    if (!MONGOOSE_URL) {
        throw new Error('!!! Bad URL')
    }

    try {
        await mongoose.connect(MONGOOSE_URL)
        console.log('connected successfully to mongo server')

    } catch {
        await mongoose.disconnect()
        console.log('connect error to mongo server')
    }
}

export async function clear_db_mongo(): Promise<boolean> {

    const asyncArray = [
        await blogsModel.deleteMany({}),
        await postsModel.deleteMany({}),
        await usersModel.deleteMany({}),
        await commentsModel.deleteMany({}),
        await rateLimitModel.deleteMany({}),
        await devicesSessionsModel.deleteMany({}),
    ]
    await Promise.all(asyncArray)
    return true
}

