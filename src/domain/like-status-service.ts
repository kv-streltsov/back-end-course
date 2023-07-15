import {LikeStatusRepositoryClass} from "../repositories/like-status-repository";
import {QueryCommentRepositoryClass} from "../repositories/query-comment-repository";
import {LikeStatus} from "../dto/interface.like";
import {inject, injectable} from "inversify";
import {QueryPostsRepositoryClass} from "../repositories/query-posts-repository";

@injectable()
export class LikeStatusServiceClass {
    constructor(
        @inject(LikeStatusRepositoryClass) protected likeStatusRepository: LikeStatusRepositoryClass,
        @inject(QueryCommentRepositoryClass) protected queryCommentRepository: QueryCommentRepositoryClass,
        @inject(QueryPostsRepositoryClass) protected queryPostRepository: QueryPostsRepositoryClass
    ) {
    }

    async putLikeStatusComment(userId: string, commentId: string, likeStatus: string) {

        const validStatus = this.likeStatusValidator(likeStatus)
        if (validStatus !== true) return validStatus

        const isCommentExist = await this.queryCommentRepository.getCommentById(commentId)
        if (isCommentExist === null) return null

        const checkLikeExist = await this.checkLikeExist(userId, commentId)//"1688041586130"
        if ((likeStatus === LikeStatus.None) && checkLikeExist) {
            return await this.likeStatusRepository.deleteLike(userId, commentId)
        }

        if (checkLikeExist === null) {
            return await this.likeStatusRepository.createLike(userId, commentId, likeStatus)
        }

        return await this.likeStatusRepository.updateLike(userId, commentId, likeStatus)
    }
    async putLikeStatusPost(userId: string, postId: string, likeStatus: string) {

        const validStatus = this.likeStatusValidator(likeStatus)
        if (validStatus !== true) return validStatus

        const isPostExist = await this.queryPostRepository.getPostById(postId)
        if (isPostExist === null) return null

        const checkLikeExist = await this.checkLikeExist(userId, postId)//"1688041586130"
        if ((likeStatus === LikeStatus.None) && checkLikeExist) {
            return await this.likeStatusRepository.deleteLike(userId, postId)
        }

        if (checkLikeExist === null) {
            return await this.likeStatusRepository.createLike(userId, postId, likeStatus)
        }

        return await this.likeStatusRepository.updateLike(userId, postId, likeStatus)
    }

    async checkLikeExist(userId: string, commentId: string) {
        return await this.likeStatusRepository.checkLikeExist(userId, commentId)
    }

    private likeStatusValidator(likeStatus: string) {
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

