import {commentsModel} from "../db/schemes/comments.scheme";

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

    getCommentsByPostId: async (
        postId: string,
        pageNumber: number = 1,
        pageSize: number = 10,
        sortDirection: number,
        sortBy: string = DEFAULT_SORT_FIELD
    ) => {
        const count: number = await commentsModel.countDocuments({postId: postId})
        if(count === 0){
            return null
        }
        const {countItems, sortField} = paginationHandler(pageNumber, pageSize, sortBy, sortDirection)
        const comments = await commentsModel.find({postId: postId}, {projection: {_id: 0,postId:0}})
            .skip(countItems)
            .sort(sortField)
            .limit(pageSize)
            .lean()

        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: comments
        }

    },
    getCommentById: async (id: string) => {
        return commentsModel.findOne({id: id},
            {projection: {_id: 0,postId:0},
        })
    }


}

