import mongoose, {Schema} from "mongoose";
import {IBlogDb} from "../../dto/interface.blog";

const blogsScheme = new Schema<IBlogDb>({
    id: String,
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean
})

export const blogsModel = mongoose.model('Blogs', blogsScheme, 'Blogs')