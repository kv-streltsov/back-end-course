"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_local_1 = require("../db/db_local");
exports.blogsRepository = {
    getAllBlogs: () => {
        return db_local_1.blogs_list;
    },
    findBlogById: (id) => {
        let findBlog = db_local_1.blogs_list.findIndex(value => value.id === id);
        if (db_local_1.blogs_list[findBlog] !== undefined)
            return db_local_1.blogs_list[findBlog];
        else
            return 404;
    },
    postBlog: (body) => {
        const newId = db_local_1.blogs_list.length + 1;
        body.id = newId.toString();
        db_local_1.blogs_list.push(body);
        return body;
    },
    putBlog: (body, id) => {
        let findIndexBlog = db_local_1.blogs_list.findIndex(value => value.id === id);
        if (findIndexBlog === -1)
            return 404;
        const updateBlog = Object.assign(Object.assign({}, db_local_1.blogs_list[findIndexBlog]), body);
        db_local_1.blogs_list.splice(findIndexBlog, 1, updateBlog);
        return 204;
    },
    deleteBlog: (id) => {
        let findIndexBlog = db_local_1.blogs_list.findIndex(value => value.id === id);
        if (findIndexBlog === -1)
            return 404;
        db_local_1.blogs_list.splice(findIndexBlog, 1);
        return 204;
    }
};
//# sourceMappingURL=blogs-repository.js.map