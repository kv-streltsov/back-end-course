import mongoose, {Schema} from "mongoose";
import {ICommentDb} from "../../dto/interface.comment";

const CommentsScheme = new Schema<ICommentDb>({
    id: String,
    postId: String,
    content: String,
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    createdAt: String
})

export const commentsModel = mongoose.model('Comments', CommentsScheme,'Comments')