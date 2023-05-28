import {InterfaceCommentView} from "../dto/interface.comment";
import {log} from "util";
import {collectionComments} from "../db/db_mongo";

export const commentsRepository = {
    createComment: async (commentObj: InterfaceCommentView) => {
        return await collectionComments.insertOne(commentObj)
    }
}