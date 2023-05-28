import {commentsRepository} from "../repositories/comments-repository";
import {InterfaceCommentInput, InterfaceCommentView} from "../dto/interface.comment";
import {InterfaceUserDb} from "../dto/interface.user";
import {collectionPosts} from "../db/db_mongo";

export const commentService = {
    postComment: async (postId: string, user: InterfaceUserDb, comment: InterfaceCommentInput) => {
        const findPost = await collectionPosts.findOne({id:postId})
        if(findPost === null){
            return null
        }

        const commentObj: InterfaceCommentView = {
            id: postId,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            content: comment.content,
            createdAt: new Date().toISOString()
        }

        const newComment = await commentsRepository.createComment({...commentObj})
        if(newComment.acknowledged){
            return commentObj
        }
        return false
    }
}