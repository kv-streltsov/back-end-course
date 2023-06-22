import {commentsModel} from "../db/schemes/comments.scheme";

const DEFAULT_SORT_FIELD = 'createdAt'
const PROJECTION  = {_id: 0,__v:0 }

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
        const comments = await commentsModel.find({postId: postId})
            .select(PROJECTION)
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
        return commentsModel.findOne({id: id}).select(PROJECTION)
    }


}

