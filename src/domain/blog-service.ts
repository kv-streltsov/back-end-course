import {InterfaceBlog, InterfaceBlogInput} from "../dto/interface.blog";
import {BlogsRepositoryClass} from "../repositories/blogs-repository";
import {InterfacePostInBlog} from "../dto/interface.post";
import {inject, injectable} from "inversify";
import {blogsModel} from "../db/schemes/blogs.scheme";


@injectable()
export class BlogsServiceClass {
    constructor(@inject(BlogsRepositoryClass)protected blogsRepository: BlogsRepositoryClass) {}

    async postBlog(body: InterfaceBlogInput) {
        return await this.blogsRepository.postBlog(body)}

    async postPostInBlog(id: string, body: InterfacePostInBlog) {
        return this.blogsRepository.postPostInBlog(id, body)
    }

    async putBlog(body: InterfaceBlog, id: string): Promise<boolean | null> {
        return this.blogsRepository.putBlog(body, id)
    }

    async deleteBlog(id: string): Promise<boolean | null> {
        return this.blogsRepository.deleteBlog(id)
    }
}
