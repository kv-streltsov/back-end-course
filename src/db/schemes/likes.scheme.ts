import mongoose, {Schema} from "mongoose";
import {IUserDb} from "../../dto/interface.user";
import {ILikesStatusDb} from "../../dto/interface.like";

const LikesStatusScheme = new Schema<ILikesStatusDb>({
    entityId:String,
    userId: String,
    status: String,
    addedAt: String
})

export const likesStatusModel = mongoose.model('LikesStatus', LikesStatusScheme, 'LikesStatus')