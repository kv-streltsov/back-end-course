import {likesStatusModel} from "../db/schemes/likes.scheme";

export class QueryLikeStatusRepositoryClass {
    async findLikeStatusByUserId(userId: string) {
        const result = await likesStatusModel.findOne({userId: userId}).select({
            __v: 0,
            _id: 0,
            commentId: 0,
            userId: 0,
        }).lean()

        if (result === null) {
            return "None"
        }
        return result.status
    }

    async getLikesCount(commentId: string) {
        return likesStatusModel.count({commentId: commentId, status: 'Like'}).lean()
    }

    async getDislikesCount(commentId: string) {
        return likesStatusModel.count({commentId: commentId, status: 'Dislike'}).lean()
    }


    async getLikesInfo(userId: string, commentId: string) {
        try {

            const like = await likesStatusModel.count({commentId: commentId, status: 'Like'}).lean()
            const disLike = await likesStatusModel.count({commentId: commentId, status: 'Dislike'}).lean()
            const likeStatus = await likesStatusModel.findOne({userId: userId}).select({
                __v: 0,
                _id: 0,
                commentId: 0,
                userId: 0,
            }).lean()

            return {
                likesCount: like,
                dislikesCount: disLike,
                myStatus: likeStatus === null ? "None" : likeStatus.status
            }


        } catch (err) {
            console.log(`getLikesInfo: `, err)
            return err
        }
    }

}