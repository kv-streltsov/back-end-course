import {collectionBlogs} from "../db/db_mongo";

export const queryBlogsRepository = {
    getAllBlogs: async () => {
        return await collectionBlogs.find({},{
            projection: { _id: 0},
        }).toArray()
    },
    getBlogById: async (id: string) => {
        return await collectionBlogs.findOne( {id: id},{
            projection: { _id: 0},
        });
    },
}