import {commentsRepository} from "../repositories/comments-repository";
import {InterfaceCommentInput, InterfaceCommentView} from "../dto/interface.comment";
import {IUserDb} from "../dto/interface.user";
import {queryCommentRepository} from "../repositories/query-comment-repository";
import {queryPostsRepository} from "../repositories/query-posts-repository";

class CommentServiceClass {
    async postComment(postId: string, user: IUserDb, comment: InterfaceCommentInput) {
        const findPost = await queryPostsRepository.getPostById(postId)
        if (findPost === null) {
            return null
        }

        const commentObj: InterfaceCommentView = {
            id: new Date().getTime().toString(),
            postId: postId,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            content: comment.content,
            createdAt: new Date().toISOString()
        }

        const newComment = await commentsRepository.createComment({...commentObj})
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
        const checkComment = await queryCommentRepository.getCommentById(commentId)

        if (checkComment === null) {
            return null
        }

        if (checkComment!.commentatorInfo.userId !== user.id) {
            return 'forbidden'
        }

        const result = await commentsRepository.updateComment(commentId, comment.content)
        if (result.matchedCount === 1) {
            return true
        } else {
            return false
        }
    }
    async deleteComment(commentId: string, user: IUserDb) {
        const checkComment = await queryCommentRepository.getCommentById(commentId)
        if (checkComment === null) {
            return null
        }
        if (checkComment!.commentatorInfo.userId !== user.id) {
            return 'forbidden'
        }

        const result = await commentsRepository.deleteComment(commentId)
        if (result.deletedCount === 1) {
            return true
        } else {
            return false
        }
    }
}

export const commentService = new CommentServiceClass()