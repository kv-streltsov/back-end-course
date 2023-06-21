"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const posts_scheme_1 = require("../db/schemes/posts.scheme");
const blogs_scheme_1 = require("../db/schemes/blogs.scheme");
exports.blogsRepository = {
    postBlog: (body) => __awaiter(void 0, void 0, void 0, function* () {
        const createData = {
            id: new Date().getTime().toString(),
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        const newBlog = Object.assign(Object.assign({}, createData), body);
        yield blogs_scheme_1.blogsModel.create(newBlog);
        return Object.assign(Object.assign({}, createData), body);
    }),
    postPostInBlog: (id, body) => __awaiter(void 0, void 0, void 0, function* () {
        const findBlogName = yield blogs_scheme_1.blogsModel.findOne({ id: id });
        if (findBlogName) {
            const createData = {
                id: new Date().getTime().toString(),
                createdAt: new Date().toISOString(),
                blogName: findBlogName.name,
                blogId: id
            };
            const newPost = Object.assign(Object.assign({}, createData), body);
            yield posts_scheme_1.postsModel.create(newPost);
            return Object.assign(Object.assign({}, createData), body);
        }
        return undefined;
    }),
    putBlog: (body, id) => __awaiter(void 0, void 0, void 0, function* () {
        const findBlog = yield blogs_scheme_1.blogsModel.findOne({ id: id });
        if (findBlog === null)
            return null;
        // а если сервер не ответит?
        yield blogs_scheme_1.blogsModel.updateOne({ id: id }, {
            $set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            }
        });
        return true;
    }),
    deleteBlog: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const deleteBlog = yield blogs_scheme_1.blogsModel.deleteOne({ id: id });
        if (deleteBlog.deletedCount) {
            return true;
        }
        else
            return null;
    })
};
//# sourceMappingURL=blogs-repository.js.map