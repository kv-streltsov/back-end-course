import {blogs_list, posts_list} from "../db/db";
import {body} from "express-validator";
import {InterfacePostInput, InterPostViewModel} from "../dto/interface.post";
import {InterfaceBlog} from "../dto/interface.blog";


export const postsRepository = {
    getAllPosts: () => {
        return posts_list
    },
    getPostById: (id: string) => {

        let findPost: number = posts_list.findIndex(value => value.id === id)
        if (posts_list[findPost] !== undefined) return posts_list[findPost]
        else return 404
    },
    postPost: (body: InterPostViewModel) => {
        const newId: number = posts_list.length + 1
        body.id = newId.toString()

        let findBlogId = blogs_list.findIndex(value => value.id === body.blogId)
        body.blogName = blogs_list[findBlogId].name
        console.log(body)
        posts_list.push(body)
        return body
    },
    putPost: (body: InterfacePostInput, id: string) => {

        let findIndexPost: number = posts_list.findIndex(value => value.id === id)
        if (findIndexPost === -1) return 404

        const updatePost: InterfacePostInput = {
            ...posts_list[findIndexPost],
            ...body
        }

        posts_list.splice(findIndexPost, 1, updatePost)
        return 204
    },
    deleteBlog: (id: string) => {

        let findIndexPost: number = posts_list.findIndex(value => value.id === id)
        if (findIndexPost === -1) return 404
        posts_list.splice(findIndexPost, 1)
        return 204

    }


}