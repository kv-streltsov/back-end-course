import {LikeStatusRepositoryClass} from "../repositories/like-status-repository";
import {QueryCommentRepositoryClass} from "../repositories/query-comment-repository";
import {createJestPreset} from "ts-jest";

export class LikeStatusServiceClass {
    private likeStatusRepository: LikeStatusRepositoryClass
    private queryCommentRepository: QueryCommentRepositoryClass

    constructor() {
        this.likeStatusRepository = new LikeStatusRepositoryClass
        this.queryCommentRepository = new QueryCommentRepositoryClass
    }


    async putLikeStatus(userId: string, commentId: string, likeStatus: string) {

        const validStatus = this.likeStatusValidator(likeStatus)
        if (validStatus !== true) return validStatus


        const checkCommentExist = await this.queryCommentRepository.getCommentById(commentId)
        if (checkCommentExist === null) return null

        const checkLikeExist = await this.checkLikeExist(userId, commentId)
        if (likeStatus === 'None' && checkLikeExist) {
            return await this.likeStatusRepository.deleteLike(userId, commentId)
        }

        if (checkLikeExist === null) {
            return await this.likeStatusRepository.createLike(userId, commentId, likeStatus)
        }
        if (checkLikeExist) {
            return await this.likeStatusRepository.updateLike(userId, commentId, likeStatus)
        }


    }

    async checkLikeExist(userId: string, commentId: string) {
        return await this.likeStatusRepository.checkLikeExist(userId, commentId)
    }

    likeStatusValidator(likeStatus: string) {
        if (likeStatus !== 'Like' && likeStatus !== 'Dislike' && likeStatus !== 'None') {
            return {
                errorsMessages: [{
                    message: "Invalid value",
                    field: "likeStatus"
                }]
            }
        }
        return true
    }

}

