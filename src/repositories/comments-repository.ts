import {ICommentDb} from "../dto/interface.comment";
import {commentsModel} from "../db/schemes/comments.scheme";
import {injectable} from "inversify";

@injectable()
export class CommentsRepositoryClass {
    async createComment(commentObj: ICommentDb) {
        return await commentsModel.create(commentObj)
    }

    async updateComment(commentId: string, comment: string) {
        return commentsModel.updateOne({id: commentId}, {$set: {content: comment}});
    }

    async deleteComment(commentId: string) {
        return commentsModel.deleteOne({id: commentId})
    }

}

