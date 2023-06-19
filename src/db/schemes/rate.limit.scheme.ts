import mongoose, {Schema} from "mongoose";
import {IRateLimitDb} from "../../dto/interface.rate.limit";

const rateLimitScheme = new Schema<IRateLimitDb>({
    ip: String,
    baseUrl: String,
    date: Number
})

export const rateLimitModel = mongoose.model('RateLimit', rateLimitScheme, 'RateLimit')