import {likesStatusModel} from "../db/schemes/likes.scheme";
import {injectable} from "inversify";

@injectable()
export class LikeStatusRepositoryClass {

    async createLike(userId: string, entityId: string, status: string) {
        await likesStatusModel.create({
            userId: userId,
            entityId: entityId,
            status: status,
            createdAt: new Date().toISOString()
        })
        return true
    }

    async updateLike(userId: string, entityId: string, status: string) {
        const result = await likesStatusModel.updateOne({
            userId: userId,
            entityId: entityId
        }, {$set: {status: status}})
        return true

    }

    async deleteLike(userId: string, commentId: string) {
        await likesStatusModel.deleteOne({
            userId: userId,
            commentId: commentId
        })
        return true

    }

    async checkLikeExist(userId: string, commentId: string) {
        return likesStatusModel.findOne({
            userId: userId,
            commentId: commentId
        })

    }
}