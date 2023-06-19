import {InterfaceCommentView} from "../dto/interface.comment";
import {commentsModel} from "../db/schemes/comments.scheme";

export const commentsRepository = {
    createComment: async (commentObj: InterfaceCommentView) => {
        return await commentsModel.create(commentObj)
    },
    updateComment: async (commentId: string, comment: string) => {
        return commentsModel.updateOne({id: commentId}, {$set: {content: comment}});
    },
    deleteComment: async (commentId: string) => {
        return  commentsModel.deleteOne({id: commentId})
    }
}