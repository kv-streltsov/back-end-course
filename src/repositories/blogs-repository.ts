import {InterfaceBlog} from "../dto/interface.blog";
import {blogs_list, video_list} from "../db/db";


export const blogsRepository = {
    getAllBlogs: (): InterfaceBlog[] => {

        return blogs_list

    },
    findBlogById: (id: string): InterfaceBlog | number => {

        let findBlog: number = blogs_list.findIndex(value => value.id === id)
        if (blogs_list[findBlog] !== undefined) return blogs_list[findBlog]
        else return 404

    },
    postBlog: (body: InterfaceBlog): InterfaceBlog => {

        const newId: number = blogs_list.length + 1
        body.id = newId.toString()
        blogs_list.push(body)
        return body

    },
    putBlog: (body: InterfaceBlog, id: string): any => {

        let findIndexBlog: number = blogs_list.findIndex(value => value.id === id)
        if (findIndexBlog === -1) return 404

        const updateBlog: InterfaceBlog = {
            ...blogs_list[findIndexBlog],
            ...body
        }

        blogs_list.splice(findIndexBlog, 1, updateBlog)
        return 204

    },
    deleteBlog: (id: string): number => {

        let findIndexBlog: number = blogs_list.findIndex(value => value.id === id)
        if (findIndexBlog === -1) return 404
        blogs_list.splice(findIndexBlog, 1)
        return 204
    }

}