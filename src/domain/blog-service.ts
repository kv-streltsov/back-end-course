import {InterfaceBlog, InterfaceBlogInput} from "../dto/interface.blog";
import {BlogsRepositoryClass} from "../repositories/blogs-repository";
import {InterfacePostInBlog} from "../dto/interface.post";

class BlogsServiceClass {
    private blogsRepository: BlogsRepositoryClass

    constructor() {
        this.blogsRepository = new BlogsRepositoryClass()
    }

    async postBlog(body: InterfaceBlogInput) {
        return this.blogsRepository.postBlog(body)
    }

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

export const blogsService = new BlogsServiceClass()

