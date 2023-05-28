import {InterfaceCommentView} from "../dto/interface.comment";
import {collectionComments} from "../db/db_mongo";

export const commentsRepository = {
    createComment: async (commentObj: InterfaceCommentView) => {
        return await collectionComments.insertOne(commentObj)
    },
    updateComment: async (commentId: string, comment: string) => {
        return await collectionComments.updateOne({id: commentId}, {$set: {content: comment}})
    },
    deleteComment: async (commentId: string) => {
        return await collectionComments.deleteOne({id: commentId})
    }
}