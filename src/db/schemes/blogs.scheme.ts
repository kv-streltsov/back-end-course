import mongoose, {Model, Schema, model} from "mongoose";

interface IBlogDb {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean
}

interface IBlogMethods {
    createBlog():{}
    sayNameBlog(): string
    deleteBlog(): boolean
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

blogsScheme.method(`postBlog`, async function createBlog(body) {
    const createData = {
        id: new Date().getTime().toString(),
        createdAt: new Date().toISOString(),
        isMembership: false
    }

    return await this.create({
        ...createData,
        ...body
    })
})

blogsScheme.method(`sayNameBlog`, async function sayNameBlog() {
    console.log(this.name)
})
blogsScheme.method(`sayNameBlog`, async function deleteBlog(id) {

})

export const blogsModel = mongoose.model<IBlogDb, BlogModel>('Blogs', blogsScheme, 'Blogs')
export const Blog = model<IBlogDb, BlogModel>(`Blog`,blogsScheme)
// const blog = new blogsModel({
//     id: new Date().getTime().toString(),
//     createdAt: new Date().toISOString(),
//     isMembership: false,
//     websiteUrl: '`qweqweqweqw',
//     name:'superpuper',
//     description:'````'
// })
// blog.save()
// console.log(blog)
