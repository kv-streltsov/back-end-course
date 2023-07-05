import {commentsModel} from "../db/schemes/comments.scheme";
import {QueryLikeStatusRepositoryClass} from "./query-like-status-repository";

export class QueryCommentRepositoryClass {
    private DEFAULT_SORT_FIELD: string = 'createdAt'
    private PROJECTION = {postId: 0, _id: 0, __v: 0}

    constructor(
        protected queryLikeStatusRepository: QueryLikeStatusRepositoryClass
    ) {}
    async getCommentsByPostId(
        postId: string,
        pageNumber: number = 1,
        pageSize: number = 10,
        sortDirection: number,
        sortBy: string = this.DEFAULT_SORT_FIELD
    ) {
        const count: number = await commentsModel.countDocuments({postId: postId})
        if (count === 0) {
            return null
        }
        const {countItems, sortField} = this.paginationHandler(pageNumber, pageSize, sortBy, sortDirection)
        const comments = await commentsModel.find({postId: postId})
            .select(this.PROJECTION)
            .skip(countItems)
            .sort(sortField)
            .limit(pageSize)
            .lean()

        const items = await Promise.all(comments.map(async comment => {
            const likesInfo = await this.queryLikeStatusRepository.getLikesInfo(comment.id, comment.commentatorInfo.userId)
            return {
                ...comment,
                likesInfo: likesInfo
            }
        }))


        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: items
        }

    }

    async getCommentById(id: string) {
        return commentsModel.findOne({id: id}).select(this.PROJECTION).lean()
    }
    paginationHandler(pageNumber: number, pageSize: number, sortBy: string, sortDirection: number) {
        const countItems = (pageNumber - 1) * pageSize;
        let sortField: any = {}
        sortField[sortBy] = sortDirection

        return {
            countItems,
            sortField
        }
    }
}

