import {collectionBlogs, collectionPosts} from "../db/db_mongo";
import {InterfaceQuery} from "../dto/inteface.query";

const DEFAULT_SORT_FIELD = 'crceatedAt'

export const paginationHandler = (pageNumber: number, pageSize: number, sortBy: string) => {
    return   (pageNumber - 1) * pageSize;
}
export const queryBlogsRepository = {

    getAllBlogs: async (
        pageNumber: number = 1,
        pageSize: number = 10,
        sortDirectioen: string,
        sortBy: string = DEFAULT_SORT_FIELD,
        searchNameTerm: string | null = null
    ) => {

        const countItems = paginationHandler(pageNumber, pageSize, sortBy)
        const findNameTerm = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {}


        const count = await collectionBlogs.countDocuments(findNameTerm)

        const blogs = await collectionBlogs.find(findNameTerm, {projection: {_id: 0}})
            .sort(sortDirectioen)
            .skip(countItems)
            .limit(pageSize)
            .toArray()

        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: blogs
        }


    },
    getBlogById: async (id: string) => {
        return await collectionBlogs.findOne({id: id}, {
            projection: {_id: 0},
        });
    },
    getPostsInBlog: async (pageNumber: number = 1, pageSize: number = 10, sortDirectioen: string, sortBy: string = 'desc', id: string) => {
        const findBlog = await collectionBlogs.findOne({id: id})
        if (findBlog === null) {
            return null
        }
        const count: number = await collectionPosts.countDocuments({blogId: id})
        const countItems = paginationHandler(pageNumber, pageSize, sortBy)
        console.log(sortDirectioen)
        const posts = await collectionPosts.find({blogId: id}, {projection: {_id: 0}})
            .sort(sortDirectioen)
            .skip(countItems)
            .limit(pageSize)
            .toArray()

        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: posts
        }
    },

}