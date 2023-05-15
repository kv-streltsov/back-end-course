import {InterfaceBlog, InterfaceBlogInput, InterfaceBlogView} from "../dto/interface.blog";
import {blogsRepository} from "../repositories/blogs-repository";


export const blogsService = {

    postBlog: async (body: InterfaceBlogInput) => {
        return blogsRepository.postBlog(body)
    },
    putBlog: async (body: InterfaceBlog, id: string): Promise<boolean | null> => {
        return blogsRepository.putBlog(body,id)

    },
    deleteBlog: async (id: string): Promise<boolean | null> => {
        return blogsRepository.deleteBlog(id)
    }

}