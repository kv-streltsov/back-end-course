import {postsModel} from "../db/schemes/posts.scheme";

const DEFAULT_SORT_FIELD: string = 'createdAt'
const PROJECTION = {_id: 0, __v: 0}

export const paginationHandler = (pageNumber: number, pageSize: number, sortBy: string, sortDirection: number) => {
    const countItems = (pageNumber - 1) * pageSize;
    let sortField: any = {}
    sortField[sortBy] = sortDirection

    return {
        countItems,
        sortField
    }
}

export class QueryPostsRepositoryClass {
    async getAllPosts(
        pageNumber: number = 1,
        pageSize: number = 10,
        sortDirection: number,
        sortBy: string = DEFAULT_SORT_FIELD
    ) {

        const count = await postsModel.countDocuments({})
        const {countItems, sortField} = paginationHandler(pageNumber, pageSize, sortBy, sortDirection)
        const posts = await postsModel.find({})
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
            items: posts
        }

    }

    async getPostById(id: string) {
        return postsModel.findOne({id: id}).select(PROJECTION)
    }
}


