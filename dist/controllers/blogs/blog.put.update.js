"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogPutUpdate = void 0;
const db_1 = require("../../db/db");
function blogPutUpdate(body, id) {
    let findIndexBlog = db_1.blogs_list.findIndex(value => value.id === id);
    if (findIndexBlog === -1)
        return 404;
    const updateBlog = Object.assign(Object.assign({}, db_1.blogs_list[findIndexBlog]), body);
    db_1.blogs_list.splice(findIndexBlog, 1, updateBlog);
    return 204;
}
exports.blogPutUpdate = blogPutUpdate;
//# sourceMappingURL=blog.put.update.js.map