import {collectionBlogs} from "../db/db_mongo";
import {InterfaceQuery} from "../dto/inteface.query";

export const queryBlogsRepository = {
    getAllBlogs: async (query: InterfaceQuery) => {
        return await collectionBlogs
            .find({name: query.searchNameTerm}, {projection: {_id: 0},})
            .skip((Number(query.pageNumber) - 1) * Number(query.pageSize))
            .limit(Number(query.pageSize))
            .sort(query.sortBy!, query.sortDirection)
            .toArray()
    },
    getBlogById: async (id: string) => {
        return await collectionBlogs.findOne({id: id}, {
            projection: {_id: 0},
        });
    },

}