import {MongoClient} from 'mongodb'
import * as dotenv from 'dotenv'


dotenv.config()
export const MONGO_URL:string | undefined = process.env.MONGO_URL

if (!MONGO_URL) {
    throw new Error('!!! Bad URL')
}
export const clientMongo = new MongoClient(MONGO_URL)
export const collectionBlogs = clientMongo.db('back-end-course').collection('Blogs')
export const collectionPosts = clientMongo.db('back-end-course').collection('Posts')
export const collectionUsers = clientMongo.db('back-end-course').collection('Users')
export const collectionComments = clientMongo.db('back-end-course').collection('Comments')
export const collectionExpiredTokens = clientMongo.db('back-end-course').collection('ExpiredTokens')

export async function runMongo() {
    try {
        await clientMongo.connect()
        await clientMongo.db("Back-end-course").command({ping: 1})
        console.log('connected successfully to mongo server')

    } catch {
        await clientMongo.close()
        console.log('connect error to mongo server')
    }
}

export async function clear_db_mongo(): Promise<boolean> {
    await collectionBlogs.deleteMany({})
    await collectionPosts.deleteMany({})
    await collectionUsers.deleteMany({})
    await collectionComments.deleteMany({})
    await collectionExpiredTokens.deleteMany({})

    return true
}

