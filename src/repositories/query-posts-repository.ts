import {collectionPosts} from "../db/db_mongo";

export const queryPostsRepository = {

    getAllPosts: async () => {
        return await collectionPosts.find({}, {
            projection: {_id: 0},
        }).toArray()
    },
    getPostById: async (id: string) => {
        return await collectionPosts.findOne({id: id}, {
            projection: {_id: 0},
        })
    }


}

