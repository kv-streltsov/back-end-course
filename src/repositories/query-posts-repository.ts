import {postsModel} from "../db/schemes/posts.scheme";
import {injectable} from "inversify";



@injectable()
export class QueryPostsRepositoryClass {

    private DEFAULT_SORT_FIELD: string = 'createdAt'
    private PROJECTION = {_id: 0, __v: 0}

    async getAllPosts(
        pageNumber: number = 1,
        pageSize: number = 10,
        sortDirection: number,
        sortBy: string = this.DEFAULT_SORT_FIELD
    ) {

        const count = await postsModel.countDocuments({})
        const {countItems, sortField} = this.paginationHandler(pageNumber, pageSize, sortBy, sortDirection)
        const posts = await postsModel.find({})
            .select(this.PROJECTION)
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
        return postsModel.findOne({id: id}).select(this.PROJECTION)
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


