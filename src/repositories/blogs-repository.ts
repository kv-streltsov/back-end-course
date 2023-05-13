import {InterfaceBlog, InterfaceBlogInput, InterfaceBlogView} from "../dto/interface.blog";
import {collectionBlogs} from "../db/db_mongo";


export const blogsRepository = {
    getAllBlogs: async () => {
        return await collectionBlogs.find({},{
            projection: { _id: 0},
        }).toArray()
    },
    findBlogById: async (id: string) => {
        return await collectionBlogs.findOne( {id: id},{
            projection: { _id: 0},
        });
    },
    postBlog: async (body: InterfaceBlogInput): Promise<InterfaceBlogView> => {

        const createData = {
            id: new Date().getTime().toString(),
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const newBlog: InterfaceBlogView = {
            ...createData,
            ...body
        }
        await collectionBlogs.insertOne(newBlog)
        return {
            ...createData,
            ...body
        }

    },
    putBlog: async (body: InterfaceBlog, id: string): Promise<boolean | null> => {

        const findBlog = await collectionBlogs.findOne({id: id})
        if (findBlog === null) return null

        // а если сервер не ответит?
        await collectionBlogs.updateOne({id: id}, {
            $set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            }
        })

        return true

    },
    deleteBlog: async (id: string): Promise<boolean | null> => {

        const deleteBlog = await collectionBlogs.deleteOne({id: id})
        if (deleteBlog.deletedCount) {
            return true
        } else return null
    }

}