import {InterfaceBlog, InterfaceBlogInput} from "../dto/interface.blog";
import {blogsRepository} from "../repositories/blogs-repository";
import {InterfacePostInBlog} from "../dto/interface.post";

class BlogsServiceClass {

    async postBlog(body: InterfaceBlogInput) {
        return blogsRepository.postBlog(body)
    }

    async postPostInBlog(id: string, body: InterfacePostInBlog) {
        return blogsRepository.postPostInBlog(id, body)
    }

    async putBlog(body: InterfaceBlog, id: string): Promise<boolean | null> {
        return blogsRepository.putBlog(body, id)
    }

    async deleteBlog(id: string): Promise<boolean | null> {
        return blogsRepository.deleteBlog(id)
    }
}

export const blogsService = new BlogsServiceClass()

