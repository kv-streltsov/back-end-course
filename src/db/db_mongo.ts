import {MongoClient} from 'mongodb'


// Replace the uri string with your MongoDB deployment's connection string.

// @ts-ignore
const URL: string = "mongodb+srv://kvstreltsov:ksdSrQnLnkqsLiwF@cluster0.34z5sen.mongodb.net/back-end-course?retryWrites=true&w=majority"
export const clientMongo = new MongoClient(URL)
export const collectionBlogs = clientMongo.db('back-end-course').collection('Blogs')

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
export function clear_db_mongo(){
    collectionBlogs.deleteMany({})
}

