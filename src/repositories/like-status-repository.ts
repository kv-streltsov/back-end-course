import {likesStatusModel} from "../db/schemes/likes.scheme";

export class LikeStatusRepositoryClass {

    async createLike(userId: string, commentId: string, status: string) {
        try {
            await likesStatusModel.create({userId: userId, commentId: commentId, status: status})
            return true
        } catch (err) {
            console.log(`create like status`, err)
            return err
        }
    }

    async updateLike(userId: string, commentId: string, status: string) {
        try {
            await likesStatusModel.updateOne({userId: userId, commentId: commentId}, {$set: {status: status}})
            return true
        } catch (err) {
            console.log(`update like status`, err)
            return err
        }
    }
    async deleteLike(userId: string, commentId: string) {
        try {
            await likesStatusModel.deleteOne({userId: userId, commentId: commentId})
            return true
        } catch (err) {
            console.log(`update like status`, err)
            return err
        }
    }

    async checkLikeExist(userId: string, commentId: string) {
        try {
            return await likesStatusModel.findOne({userId: userId, commentId: commentId})
        } catch (err) {
            console.log(`checkLikeExist`, err)
            return err
        }
    }
}