import {postsModel} from "../db/schemes/posts.scheme";
import {injectable} from "inversify";
import {likesStatusModel} from "../db/schemes/likes.scheme";
import {LikeStatus} from "../dto/interface.like";



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
        return postsModel.findOne({id: id}).select(this.PROJECTION).lean()
    }
    async getLikesInfo(postId: string, userId: string | null = null) {

        const like = await likesStatusModel.countDocuments({commentId: postId, status: LikeStatus.Like}).lean()
        const disLike = await likesStatusModel.countDocuments({commentId: postId, status: LikeStatus.Dislike}).lean()
        const likeStatus = await likesStatusModel.findOne({userId: userId, commentId: postId}).select({
            __v: 0,
            _id: 0,
            commentId: 0,
            userId: 0,
        }).lean()

        return {
            likesCount: like,
            dislikesCount: disLike,
            myStatus: likeStatus === null ? LikeStatus.None : likeStatus.status
        }


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


