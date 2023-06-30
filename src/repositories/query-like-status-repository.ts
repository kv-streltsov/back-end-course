import {likesStatusModel} from "../db/schemes/likes.scheme";
import {LikeStatus} from "../dto/interface.like";

export class QueryLikeStatusRepositoryClass {

    async findLikeStatusByUserId(userId: string) {
        const result = await likesStatusModel.findOne({userId: userId}).select({
            __v: 0,
            _id: 0,
            commentId: 0,
            userId: 0,
        }).lean()

        if (result === null) {
            return LikeStatus.None
        }
        return result.status
    }

    async getLikesCount(commentId: string) {
        return likesStatusModel.count({commentId: commentId, status: LikeStatus.Like}).lean()
    }

    async getDislikesCount(commentId: string) {
        return likesStatusModel.count({commentId: commentId, status: LikeStatus.Dislike}).lean()
    }


    async getLikesInfo(commentId: string, userId: string | null = null) {

        const like = await likesStatusModel.countDocuments({commentId: commentId, status: LikeStatus.Like}).lean()
        const disLike = await likesStatusModel.countDocuments({commentId: commentId, status: LikeStatus.Dislike}).lean()
        const likeStatus = await likesStatusModel.findOne({userId: userId, commentId: commentId}).select({
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

}