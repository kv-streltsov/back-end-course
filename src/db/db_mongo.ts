import {MongoClient} from 'mongodb'
import * as dotenv from 'dotenv'
import mongoose, {Schema} from "mongoose";
import {IDeviceDb} from "../dto/interface.device";
import any = jasmine.any;


dotenv.config()
export const MONGO_URL: string | undefined = process.env.MONGO_URL

if (!MONGO_URL) {
    throw new Error('!!! Bad URL')
}
export const clientMongo = new MongoClient(MONGO_URL)
export const collectionBlogs = clientMongo.db('back-end-course').collection('Blogs')
export const collectionPosts = clientMongo.db('back-end-course').collection('Posts')
export const collectionUsers = clientMongo.db('back-end-course').collection('Users')
export const collectionComments = clientMongo.db('back-end-course').collection('Comments')
export const collectionRateLimit = clientMongo.db('back-end-course').collection('RateLimit')
export const collectionDevicesSessions = clientMongo.db('back-end-course').collection('DevicesSessions')

const devicesSessionsScheme = new Schema<IDeviceDb>({
    issued: String,
    expiration: String,
    userId: String,
    deviceId: String,
    userAgent: String,
    ip: String
})
export const devicesSessionsModel = mongoose.model('DevicesSessions', devicesSessionsScheme)

export async function runMongo() {
    try {
        await mongoose.connect(MONGO_URL + 'back-end-course')
        await clientMongo.connect() // old
        await clientMongo.db("Back-end-course").command({ping: 1}) // old
        console.log('connected successfully to mongo server')

    } catch {
        await clientMongo.close()
        console.log('connect error to mongo server')
    }
}

export async function clear_db_mongo(): Promise<boolean> {

    const asyncArray = [
        await collectionBlogs.deleteMany({}),
        await collectionPosts.deleteMany({}),
        await collectionUsers.deleteMany({}),
        await collectionComments.deleteMany({}),
        await collectionRateLimit.deleteMany({}),
        await devicesSessionsModel.deleteMany({}),
    ]
    await Promise.all(asyncArray)
    return true
}

