import {InterfaceBlog, InterfaceBlogInput, InterfaceBlogView} from "../dto/interface.blog";
import {collectionBlogs, collectionPosts} from "../db/db_mongo";
import {InterfacePostInBlog, InterfacePostView} from "../dto/interface.post";


export const blogsRepository = {

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
    postPostInBlog: async (id: string, body: InterfacePostInBlog) => {
        const findBlogName = await collectionBlogs.findOne({id: id})

        if (findBlogName) {
            const createData = {
                id: new Date().getTime().toString(),
                createdAt: new Date().toISOString(),
                blogName: findBlogName.name,
                blogId: id,
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content

            }

            await collectionPosts.insertOne(createData)
            console.log(123)
            console.log(createData)
            return createData
        }
        return undefined

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