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
exports.PostsRepositoryClass = void 0;
const posts_scheme_1 = require("../db/schemes/posts.scheme");
const blogs_scheme_1 = require("../db/schemes/blogs.scheme");
class PostsRepositoryClass {
    postPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const findBlogName = yield blogs_scheme_1.blogsModel.findOne({ id: body.blogId });
            if (findBlogName) {
                const createData = {
                    id: new Date().getTime().toString(),
                    createdAt: new Date().toISOString(),
                    blogName: findBlogName.name
                };
                const newPost = Object.assign(Object.assign({}, createData), body);
                yield posts_scheme_1.postsModel.create(newPost);
                return Object.assign(Object.assign({}, createData), body);
            }
            return undefined;
        });
    }
    putPost(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findPost = yield posts_scheme_1.postsModel.findOne({ id: id });
            if (findPost === null)
                return null;
            yield posts_scheme_1.postsModel.updateOne({ id: id }, {
                $set: {
                    title: body.title,
                    shortDescription: body.shortDescription,
                    content: body.content,
                    blogId: body.blogId,
                }
            });
            return true;
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletePost = yield posts_scheme_1.postsModel.deleteOne({ id: id });
            if (deletePost.deletedCount) {
                return true;
            }
            else
                return null;
        });
    }
}
exports.PostsRepositoryClass = PostsRepositoryClass;
//# sourceMappingURL=posts-repository.js.map