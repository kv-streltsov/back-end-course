import {ICommentDb, InterfaceCommentInput} from "../dto/interface.comment";
import {IUserDb} from "../dto/interface.user";
import {CommentsRepositoryClass} from "../repositories/comments-repository";
import {QueryPostsRepositoryClass} from "../repositories/query-posts-repository";
import {QueryCommentRepositoryClass} from "../repositories/query-comment-repository";

export class CommentServiceClass {

    constructor(
        protected commentsRepository: CommentsRepositoryClass,
        protected queryPostsRepository: QueryPostsRepositoryClass,
        protected queryCommentRepository: QueryCommentRepositoryClass
    ) {}

    async postComment(postId: string, user: IUserDb, comment: InterfaceCommentInput) {

        const findPost = await this.queryPostsRepository.getPostById(postId)
        if (findPost === null) {
            return null
        }

        const commentObj: ICommentDb = {
            id: new Date().getTime().toString(),
            postId: postId,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            content: comment.content,
            createdAt: new Date().toISOString()
        }

        const newComment = await this.commentsRepository.createComment({...commentObj})
        if (newComment) {
            return {
                id: commentObj.id,
                commentatorInfo: commentObj.commentatorInfo,
                content: commentObj.content,
                createdAt: commentObj.createdAt
            }
        }
        return false
    }

    async putComment(commentId: string, user: IUserDb, comment: InterfaceCommentInput) {
        const checkComment = await this.queryCommentRepository.getCommentById(commentId)

        if (checkComment === null) {
            return null
        }

        if (checkComment!.commentatorInfo.userId !== user.id) {
            return 'forbidden'
        }

        const result = await this.commentsRepository.updateComment(commentId, comment.content)
        if (result.matchedCount === 1) {
            return true
        } else {
            return false
        }
    }

    async deleteComment(commentId: string, user: IUserDb) {
        const checkComment = await this.queryCommentRepository.getCommentById(commentId)
        if (checkComment === null) {
            return null
        }
        if (checkComment!.commentatorInfo.userId !== user.id) {
            return 'forbidden'
        }

        const result = await this.commentsRepository.deleteComment(commentId)
        if (result.deletedCount === 1) {
            return true
        } else {
            return false
        }
    }
}

