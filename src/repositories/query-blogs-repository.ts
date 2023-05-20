import {collectionBlogs, collectionPosts} from "../db/db_mongo";

const DEFAULT_SORT_FIELD = 'createdAt'

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

    getAllBlogs: async (
        pageNumber: number = 1,
        pageSize: number = 10,
        sortDirection: number,
        sortBy: string = DEFAULT_SORT_FIELD,
        searchNameTerm: string | null = null
    ) => {

        const {countItems, sortField} = paginationHandler(pageNumber, pageSize, sortBy, sortDirection)
        const findNameTerm = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {}

        const count: number = await collectionBlogs.countDocuments(findNameTerm)
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
    getPostsInBlog: async (pageNumber: number = 1, pageSize: number = 10, sortDirection: number, sortBy: string = DEFAULT_SORT_FIELD, id: string) => {

        const findBlog = await collectionBlogs.findOne({id: id})
        if (findBlog === null) {
            return null
        }
        console.log(sortBy, sortDirection, 'q2')
        const count: number = await collectionPosts.countDocuments({blogId: id})
        const {countItems, sortField} = paginationHandler(pageNumber, pageSize, sortBy, sortDirection)
        console.log(sortBy, sortDirection)
        const posts = await collectionPosts.find({blogId: id}, {projection: {_id: 0}})
            .sort(sortBy, sortDirection)
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