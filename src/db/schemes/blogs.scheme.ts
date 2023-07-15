import mongoose, {Model, Schema, model} from "mongoose";
import {InterfaceBlogInput, InterfaceBlogView} from "../../dto/interface.blog";
import {log} from "util";
import exp from "constants";

interface IBlogDb {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

interface IBlogMethods {
    createBlog(body: InterfaceBlogInput): {}

    getBlogById(id: string): {}
}

type BlogModel = Model<IBlogDb, {}, IBlogMethods>

const blogsScheme = new Schema<IBlogDb, BlogModel, IBlogMethods>({
    id: {type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: {type: String, required: true},
    createdAt: {type: String, required: true},
    isMembership: Boolean
})

blogsScheme.method(`createBlog`, async function createBlog(body) {
   // console.log(`this: `, this)
    const createData = {
        id: new Date().getTime().toString(),
        createdAt: new Date().toISOString(),
        isMembership: false
    }
    const newBlogData: InterfaceBlogView = {
        ...createData,
        ...body
    }
    const blog = new blogsModel(newBlogData);
    return blog.save()

})
blogsScheme.method(`getBlogById`, async function getBlogById(id: string) {
    console.log(`id`)
    const blog =  blogsModel.findById({id: id})
    console.log(`blog: !@!!`, blog)
})

export const blogsModel = mongoose.model<IBlogDb, BlogModel>('Blogs', blogsScheme, 'Blogs')
export const Blog = new blogsModel()
