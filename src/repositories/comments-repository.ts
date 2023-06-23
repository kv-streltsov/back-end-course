import {InterfaceCommentView} from "../dto/interface.comment";
import {commentsModel} from "../db/schemes/comments.scheme";

export class CommentsRepositoryClass {
    async createComment(commentObj: InterfaceCommentView) {
        return await commentsModel.create(commentObj)
    }

    async updateComment(commentId: string, comment: string) {
        return commentsModel.updateOne({id: commentId}, {$set: {content: comment}});
    }

    async deleteComment(commentId: string) {
        return commentsModel.deleteOne({id: commentId})
    }

}

