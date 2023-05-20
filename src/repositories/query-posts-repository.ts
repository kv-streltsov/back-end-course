import {collectionPosts} from "../db/db_mongo";

export const queryPostsRepository = {

    getAllPosts: async (pageNumber: number = 1, pageSize: number = 11, sortBy: string = 'createAt',sortDirection:string = 'desc') => {

        console.log(pageSize)
        const count = await collectionPosts.countDocuments({})
        const posts = await collectionPosts.find({},{projection: {_id: 0}})
            .skip((pageNumber - 1) * pageSize)
            .sort(sortDirection)
            .limit(pageSize)
            .toArray()
        console.log()
        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: posts
        }

    },
    getPostById: async (id: string) => {
        return await collectionPosts.findOne({id: id}, {
            projection: {_id: 0},
        })
    }


}

