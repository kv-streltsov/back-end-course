import {collectionComments, collectionPosts} from "../db/db_mongo";

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
export const queryCommentRepository = {

    getAllComments: async (
        postId: string,
        pageNumber: number = 1,
        pageSize: number = 10,
        sortDirection: number,
        sortBy: string = DEFAULT_SORT_FIELD
    ) => {
        const count: number = await collectionComments.countDocuments({id: postId})
        const {countItems, sortField} = paginationHandler(pageNumber, pageSize, sortBy, sortDirection)
        const comments = await collectionComments.find({id: postId}, {projection: {_id: 0}})
            .skip(countItems)
            .sort(sortField)
            .limit(pageSize)
            .toArray()

        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: comments
        }

    },
    getPostById: async (id: string) => {
        return await collectionPosts.findOne({id: id}, {
            projection: {_id: 0},
        })
    }


}
