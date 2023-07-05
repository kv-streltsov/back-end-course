import {LikeStatusRepositoryClass} from "../repositories/like-status-repository";
import {QueryCommentRepositoryClass} from "../repositories/query-comment-repository";
import {LikeStatus} from "../dto/interface.like";

export class LikeStatusServiceClass {


    constructor(
        protected likeStatusRepository: LikeStatusRepositoryClass,
        protected queryCommentRepository: QueryCommentRepositoryClass
    ) {    }


    async putLikeStatus(userId: string, commentId: string, likeStatus: string) {

        const validStatus = this.likeStatusValidator(likeStatus)
        if (validStatus !== true) return validStatus


        const checkCommentExist = await this.queryCommentRepository.getCommentById(commentId)
        if (checkCommentExist === null) return null

        const checkLikeExist = await this.checkLikeExist(userId, commentId)//"1688041586130"
        if ((likeStatus === LikeStatus.None) && checkLikeExist) {
            return await this.likeStatusRepository.deleteLike(userId, commentId)
        }

        if (checkLikeExist === null) {
            return await this.likeStatusRepository.createLike(userId, commentId, likeStatus)
        }

        return await this.likeStatusRepository.updateLike(userId, commentId, likeStatus)


    }

    async checkLikeExist(userId: string, commentId: string) {
        return await this.likeStatusRepository.checkLikeExist(userId, commentId)
    }

    likeStatusValidator(likeStatus: string) {
        if (likeStatus !== LikeStatus.Like && likeStatus !== LikeStatus.Dislike && likeStatus !== LikeStatus.None) {
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

