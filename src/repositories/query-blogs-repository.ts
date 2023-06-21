import {InterfaceGetBlogsWitchQuery} from "../dto/interface.blog";
import {WithId} from "mongodb";
import {postsModel} from "../db/schemes/posts.scheme";
import {blogsModel} from "../db/schemes/blogs.scheme";

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
    ):Promise<InterfaceGetBlogsWitchQuery> => {

        const {countItems, sortField} = paginationHandler(pageNumber, pageSize, sortBy, sortDirection)
        const findNameTerm = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {}

        const count: number = await blogsModel.countDocuments(findNameTerm)
        const blogs = await blogsModel.find(findNameTerm, {projection: {_id: 0}})
            .sort(sortField)
            .skip(countItems)
            .limit(pageSize)
            .lean()

        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: blogs
        }


    },

    getBlogById: async (id: string) => {
        return blogsModel.findOne({id: id}, {
            projection: {_id: 0},
        });
    },
    getPostsInBlog: async (pageNumber: number = 1, pageSize: number = 10, sortDirection: number, sortBy: string = DEFAULT_SORT_FIELD, id: string):Promise<WithId<any>> => {
        const findBlog = await blogsModel.findOne({id: id})
        if (findBlog === null) {
            return null
        }
        const count: number = await postsModel.countDocuments({blogId: id})
        const {countItems, sortField} = paginationHandler(pageNumber, pageSize, sortBy, sortDirection)
        const posts = await postsModel.find({blogId: id}, {projection: {_id: 0}})
            .sort(sortField)
            .skip(countItems)
            .limit(pageSize)
            .lean()
        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: posts
        }
    },

}