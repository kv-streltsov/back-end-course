"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const db_1 = require("../db/db");
exports.postsRepository = {
    getAllPosts: () => {
        return db_1.posts_list;
    },
    getPostById: (id) => {
        let findPost = db_1.posts_list.findIndex(value => value.id === id);
        if (db_1.posts_list[findPost] !== undefined)
            return db_1.posts_list[findPost];
        else
            return 404;
    },
    postPost: (body) => {
        const newId = db_1.posts_list.length + 1;
        body.id = newId.toString();
        let findBlogId = db_1.blogs_list.findIndex(value => value.id === body.blogId);
        // body.blogName = blogs_list[findBlogId].name
        body.blogName = 'srewrew';
        db_1.posts_list.push(body);
        return body;
    },
    putPost: (body, id) => {
        let findIndexPost = db_1.posts_list.findIndex(value => value.id === id);
        if (findIndexPost === -1)
            return 404;
        const updatePost = Object.assign(Object.assign({}, db_1.posts_list[findIndexPost]), body);
        db_1.posts_list.splice(findIndexPost, 1, updatePost);
        return 204;
    },
    deletePost: (id) => {
        let findIndexPost = db_1.posts_list.findIndex(value => value.id === id);
        if (findIndexPost === -1)
            return 404;
        db_1.posts_list.splice(findIndexPost, 1);
        return 204;
    }
};
//# sourceMappingURL=posts-repository.js.map