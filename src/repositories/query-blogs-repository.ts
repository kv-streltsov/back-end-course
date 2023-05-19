import {collectionBlogs, collectionPosts} from "../db/db_mongo";
import {InterfaceQuery} from "../dto/inteface.query";

const DEFAULT_SORT_FIELD = 'crceatedAt'

export const paginationHandler = (pageNumber: number, pageSize: number, sortBy: string, sortDirection: number) => {
    const countItems = (pageNumber - 1) * pageSize;

    let sortField: any = {}
    sortField[sortBy] = sortDirection

    return {
        countItems,
        sortField
    }
}
export const queryBlogsRepository = {

    getAllBlogs: async (pageNumber: number = 1, pageSize: number = 10, sortDirectioen: number, sortBy: string = DEFAULT_SORT_FIELD, searchNameTerm: string | null = null) => {

        const {countItems, sortField} = paginationHandler(pageNumber, pageSize, sortBy, sortDirectioen)
        const findNameTerm = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {}


        const count = await collectionBlogs.countDocuments(findNameTerm)

        const blogs = await collectionBlogs.find(findNameTerm, {projection: {_id: 0}})
            .sort(sortField)
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
    getPostsInBlog: async (pageNumber: number = 1, pageSize: number = 10, sortDirectioen: number, sortBy: string = DEFAULT_SORT_FIELD, id: string) => {

        const findBlog = await collectionBlogs.findOne({id: id})
        console.log(findBlog)
        if (findBlog === null) {
            return null
        }
        const count: number = await collectionBlogs.countDocuments({id: id})
        const {countItems, sortField} = paginationHandler(pageNumber, pageSize, sortBy, sortDirectioen)

        const posts = await collectionPosts.find({id: id}, {projection: {_id: 0}})
            .sort(sortField)
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