import mongoose, {Schema} from "mongoose";
import {IUserDb} from "../../dto/interface.user";
import {ILikesStatusDb} from "../../dto/interface.like";

const LikesStatusScheme = new Schema<ILikesStatusDb>({
    commentId:String,
    userId: String,
    status: String
})

export const likesStatusModel = mongoose.model('LikesStatus', LikesStatusScheme, 'LikesStatus')