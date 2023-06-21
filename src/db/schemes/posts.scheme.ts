import mongoose, {Schema} from "mongoose";
import {IPostDb} from "../../dto/interface.post";

const UsersScheme = new Schema<IPostDb>({
    id: String,
    title: String,
    shortDescription: String,
    content: String,
    blogId: String,
    blogName: String,
    createdAt: String,
})

export const postsModel = mongoose.model('Posts', UsersScheme, 'Posts')