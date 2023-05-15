import {InterfacePostInput, InterfacePostView} from "../dto/interface.post";
import {collectionBlogs, collectionPosts} from "../db/db_mongo";


export const postsRepository = {

    postPost: async (body: InterfacePostInput): Promise<InterfacePostView | undefined> => {

        const findBlogName = await collectionBlogs.findOne({id: body.blogId})

        if (findBlogName) {
            const createData = {
                id: new Date().getTime().toString(),
                createdAt: new Date().toISOString(),
                blogName: findBlogName.name
            }

            const newPost: InterfacePostView = {
                ...createData,
                ...body
            }
            await collectionPosts.insertOne(newPost)
            return {
                ...createData,
                ...body
            }
        }
        return undefined


    },
    putPost: async (body: InterfacePostInput, id: string): Promise<boolean | null> => {

        const findPost = await collectionPosts.findOne({id: id})
        if (findPost === null) return null

        await collectionPosts.updateOne({id: id}, {
            $set: {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
            }
        })
        return true
    },
    deletePost: async (id: string): Promise<boolean | null> => {
        const deletePost = await collectionPosts.deleteOne({id: id})
        if (deletePost.deletedCount) {
            return true
        } else return null
    }


}

