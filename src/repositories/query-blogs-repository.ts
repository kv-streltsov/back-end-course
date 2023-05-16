import {collectionBlogs, collectionPosts} from "../db/db_mongo";
import {InterfaceQuery} from "../dto/inteface.query";

export const queryBlogsRepository = {
    getAllBlogs: async (query: InterfaceQuery) => {

        const searchParams = {
            searchNameTerm: query.searchNameTerm || {},
            sortBy: query.sortBy || 'createdAt',
            sortDirection: query.sortDirection || 'desc',
            pageNumber: query.pageNumber || '1',
            pageSize: query.pageSize || '10'
        }

        return {
            "pagesCount": Number(searchParams.pageNumber),
            "page": Number(searchParams.pageNumber),
            "pageSize": Number(searchParams.pageSize),
            "totalCount": Number(searchParams.pageNumber),
            "items": await collectionBlogs
                .find({name: query.searchNameTerm}, {projection: {_id: 0},})
                .skip((Number(searchParams.pageNumber) - 1) * Number(searchParams.pageSize))
                .limit(Number(query.pageSize))
                .sort(searchParams.sortBy!, searchParams.sortDirection)
                .toArray()
        }
    },
    getBlogById: async (id: string) => {
        return await collectionBlogs.findOne({id: id}, {
            projection: {_id: 0},
        });
    },
    getPostsInBlog: async (id: string, query: InterfaceQuery) => {
        const findBlog = await collectionBlogs.findOne({id: id})
        if(findBlog === null){
            return null
        }
        const searchParams = {
            searchNameTerm: query.searchNameTerm || {},
            sortBy: query.sortBy || 'createdAt',
            sortDirection: query.sortDirection || 'desc',
            pageNumber: query.pageNumber || '1',
            pageSize: query.pageSize || '10'
        }

        return {
            "pagesCount": Number(searchParams.pageNumber),
            "page": Number(searchParams.pageNumber),
            "pageSize": Number(searchParams.pageSize),
            "totalCount": Number(searchParams.pageNumber),
            "items": await collectionPosts
                .find({name: query.searchNameTerm}, {projection: {_id: 0},})
                .skip((Number(searchParams.pageNumber) - 1) * Number(searchParams.pageSize))
                .limit(Number(query.pageSize))
                .sort(searchParams.sortBy!, searchParams.sortDirection)
                .toArray()
        }
    },

}