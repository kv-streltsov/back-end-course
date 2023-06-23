import {InterfacePostInput, InterfacePostView} from "../dto/interface.post";
import {postsModel} from "../db/schemes/posts.scheme";
import {blogsModel} from "../db/schemes/blogs.scheme";

class postsRepositoryClass {
    async postPost(body: InterfacePostInput): Promise<InterfacePostView | undefined> {

        const findBlogName = await blogsModel.findOne({id: body.blogId})

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
            await postsModel.create(newPost)
            return {
                ...createData,
                ...body
            }
        }
        return undefined


    }
    async putPost(body: InterfacePostInput, id: string): Promise<boolean | null> {

        const findPost = await postsModel.findOne({id: id})
        if (findPost === null) return null

        await postsModel.updateOne({id: id}, {
            $set: {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
            }
        })
        return true
    }
    async deletePost(id: string): Promise<boolean | null> {
        const deletePost = await postsModel.deleteOne({id: id})
        if (deletePost.deletedCount) {
            return true
        } else return null
    }
}

export const postsRepository = new postsRepositoryClass

