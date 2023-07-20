import {likesStatusModel} from "../db/schemes/likes.scheme";
import {LikeStatus} from "../dto/interface.like";
import {inject, injectable} from "inversify";
import {UsersRepositoryClass} from "./users-repository";

@injectable()
export class QueryLikeStatusRepositoryClass {

    constructor(@inject(UsersRepositoryClass)protected usersRepository: UsersRepositoryClass) {
    }

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


    async getLikesInfo(entityId: string, userId: string | null = null) {

        const like = await likesStatusModel.countDocuments({entityId: entityId, status: LikeStatus.Like}).lean()
        const disLike = await likesStatusModel.countDocuments({entityId: entityId, status: LikeStatus.Dislike}).lean()
        const likeStatus = await likesStatusModel.findOne({userId: userId, entityId: entityId}).select({
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
    async getExtendedLikesInfo(entityId: string, userId: string | null = null) {

        const like = await likesStatusModel.countDocuments({entityId: entityId, status: LikeStatus.Like}).lean()
        const disLike = await likesStatusModel.countDocuments({entityId: entityId, status: LikeStatus.Dislike}).lean()
        const newestLikes = await likesStatusModel.find({entityId: entityId}).sort({addedAt:1}).limit(3).select({
            __v: 0,
            _id: 0,
            entityId: 0,
            status:0,

        }).lean()

        const likeStatus = await likesStatusModel.findOne({userId: userId, entityId: entityId}).select({
            __v: 0,
            _id: 0,
            commentId: 0,
            userId: 0,
            entityId: 0,
            addedAt: 0
        }).lean()

        const newLikes = await Promise.all(newestLikes.map(async like => {
            const findUser = await this.usersRepository.findUserById(like.userId)
            const login = findUser!.login
            return {
                userId:like.userId,
                addedAt:like.addedAt,
                login: login
            }

        }))

        return  {
                likesCount: like,
                dislikesCount: disLike,
                myStatus: (likeStatus === null) ? `None` : likeStatus.status,
                newestLikes: newLikes
        }




    }


}