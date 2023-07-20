import {likesStatusModel} from "../db/schemes/likes.scheme";
import {injectable} from "inversify";

@injectable()
export class LikeStatusRepositoryClass {

    async createLike(userId: string, entityId: string, status: string) {
        await likesStatusModel.create({
            userId: userId,
            entityId: entityId,
            status: status,
            addedAt: new Date().toISOString()
        })
        return true
    }

    async updateLike(userId: string, entityId: string, status: string) {
        const result = await likesStatusModel.updateOne({
            userId: userId,
            entityId: entityId
        }, {$set: {status: status,addedAt: new Date().toISOString()}}
        )
        return true

    }

    async deleteLike(userId: string, entityId: string) {
        await likesStatusModel.deleteOne({
            userId: userId,
            entityId: entityId
        })
        return true

    }

    async checkLikeExist(userId: string, entityId: string) {
        return likesStatusModel.findOne({
            userId: userId,
            entityId: entityId
        })

    }
}