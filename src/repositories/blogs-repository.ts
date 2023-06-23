import {InterfaceBlog, InterfaceBlogInput, InterfaceBlogView} from "../dto/interface.blog";
import {InterfacePostInBlog, InterfacePostView} from "../dto/interface.post";
import {WithId} from "mongodb";
import {postsModel} from "../db/schemes/posts.scheme";
import {blogsModel} from "../db/schemes/blogs.scheme";

export class BlogsRepositoryClass {

    async postBlog(body: InterfaceBlogInput): Promise<InterfaceBlogView> {

        const createData = {
            id: new Date().getTime().toString(),
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const newBlog: InterfaceBlogView = {
            ...createData,
            ...body
        }
        await blogsModel.create(newBlog)
        return {
            ...createData,
            ...body
        }

    }
    async postPostInBlog(id: string, body: InterfacePostInBlog): Promise<InterfacePostView | undefined> {
        const findBlogName: WithId<any> = await blogsModel.findOne({id: id})

        if (findBlogName) {
            const createData = {
                id: new Date().getTime().toString(),
                createdAt: new Date().toISOString(),
                blogName: findBlogName.name,
                blogId: id
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
    async putBlog(body: InterfaceBlog, id: string): Promise<boolean | null> {

        const findBlog = await blogsModel.findOne({id: id})
        if (findBlog === null) return null

        await blogsModel.updateOne({id: id}, {
            $set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            }
        })

        return true

    }
    async deleteBlog(id: string): Promise<boolean | null> {

        const deleteBlog = await blogsModel.deleteOne({id: id})
        if (deleteBlog.deletedCount) {
            return true
        } else return null
    }

}

