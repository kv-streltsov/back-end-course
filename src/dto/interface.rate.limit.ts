import {ObjectId} from "mongodb";

export interface IRateLimitDb {
    _id: ObjectId,
    ip: string,
    baseUrl: string,
    date:number
}