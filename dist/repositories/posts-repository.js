"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const db_local_1 = require("../db/db_local");
exports.postsRepository = {
    getAllPosts: () => {
        return db_local_1.posts_list;
    },
    getPostById: (id) => {
        let findPost = db_local_1.posts_list.findIndex(value => value.id === id);
        if (db_local_1.posts_list[findPost] !== undefined)
            return db_local_1.posts_list[findPost];
        else
            return 404;
    },
    postPost: (body) => {
        const newId = db_local_1.posts_list.length + 1;
        body.id = newId.toString();
        let findBlogId = db_local_1.blogs_list.findIndex(value => value.id === body.blogId);
        body.blogName = db_local_1.blogs_list[findBlogId].name;
        db_local_1.posts_list.push(body);
        return body;
    },
    putPost: (body, id) => {
        let findIndexPost = db_local_1.posts_list.findIndex(value => value.id === id);
        if (findIndexPost === -1)
            return 404;
        const updatePost = Object.assign(Object.assign({}, db_local_1.posts_list[findIndexPost]), body);
        db_local_1.posts_list.splice(findIndexPost, 1, updatePost);
        return 204;
    },
    deletePost: (id) => {
        let findIndexPost = db_local_1.posts_list.findIndex(value => value.id === id);
        if (findIndexPost === -1)
            return 404;
        db_local_1.posts_list.splice(findIndexPost, 1);
        return 204;
    }
};
//# sourceMappingURL=posts-repository.js.map