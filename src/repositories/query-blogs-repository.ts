import {collectionBlogs, collectionPosts} from "../db/db_mongo";
import {InterfaceQuery} from "../dto/inteface.query";

const DEFAULT_SORT_FIELD = 'crceatedAt'

export const paginationHandler = (pageNumber: number, pageSize: number, sortBy: string, sortDirection: number) => {
    const countItems = (pageNumber - 1) * pageSize;

    let sortField: any = {}
    sortField[sortBy] = sortDirection

    return{
        countItems,
        sortField
    }
}
export const queryBlogsRepository = {
    getAllBlogs: async (
                       pageNumber: number = 1,
                        pageSize: number = 10,
                        sortDirectioen: number,
                        sortBy: string = DEFAULT_SORT_FIELD,
                        searchNameTerm: string | null = null
                        ) => {

        // const query1 = {$text: {$search: "va"}};

        const {countItems, sortField} = paginationHandler(pageNumber, pageSize, sortBy, sortDirectioen)
        const findNameTerm = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {}


   const count = await collectionBlogs.countDocuments(findNameTerm)
   const blogs = await  collectionBlogs.find(findNameTerm,{projection: {_id: 0}})
       .sort(sortField)
       .skip(countItems)
       .limit(pageSize)
       .toArray()

        return{
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: blogs
        }

        // return {
        //     "pagesCount": pageNumber,
        //     "page": pageNumber,
        //     "pageSize": pageSize,
        //     "totalCount": pageNumber,
        //     "items": await collectionBlogs
        //         .find(query1, )
        //         .skip((pageNumber - 1) * pageSize)
        //         .limit(pageSize)
        //         .sort(sortBy, sortDirection)
        //         .toArray()
        // }
    },
    getBlogById: async (id: string) => {
        return await collectionBlogs.findOne({id: id}, {
            projection: {_id: 0},
        });
    },
    getPostsInBlog: async (id: string, query: InterfaceQuery) => {

        const findBlog = await collectionBlogs.findOne({id: id})
        if (findBlog === null) {
            return null
        }
        const searchParams = {
            searchNameTerm: query.searchNameTerm || {},
            sortBy: query.sortBy || 'createdAt',
            sortDirection: query.sortDirection || 'desc',
            pageNumber: query.pageNumber || '1',
            pageSize: query.pageSize || '10'
        }

        const totalCount: number = await collectionPosts.countDocuments({name: query.searchNameTerm}) - 1

        return {
            "pagesCount": Math.ceil(totalCount / Number(searchParams.pageSize)),
            "page": Number(searchParams.pageNumber),
            "pageSize": Number(searchParams.pageSize),
            "totalCount": totalCount,
            "items": await collectionPosts
                .find({}, {projection: {_id: 0},})
                .skip((Number(searchParams.pageNumber) - 1) * Number(searchParams.pageSize))
                .limit(Number(query.pageSize))
                .sort(searchParams.sortBy!, searchParams.sortDirection)
                .toArray()
        }
    },

}