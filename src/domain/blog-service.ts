import {InterfaceBlog, InterfaceBlogInput, InterfaceBlogView} from "../dto/interface.blog";
import {blogsRepository} from "../repositories/blogs-repository";
import {InterfacePostInBlog} from "../dto/interface.post";


export const blogsService = {

    postBlog: async (body: InterfaceBlogInput) => {
        return blogsRepository.postBlog(body)
    },
    postPostInBlog: async (id:string, body:InterfacePostInBlog) => {
        return blogsRepository.postPostInBlog(id, body)
    },
    putBlog: async (body: InterfaceBlog, id: string): Promise<boolean | null> => {
        return blogsRepository.putBlog(body, id)

    },
    deleteBlog: async (id: string): Promise<boolean | null> => {
        return blogsRepository.deleteBlog(id)
    }

}