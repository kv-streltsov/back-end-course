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
exports.postsRepository = void 0;
const db_mongo_1 = require("../db/db_mongo");
exports.postsRepository = {
    getAllPosts: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_mongo_1.collectionPosts.find().toArray();
    }),
    getPostById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_mongo_1.collectionPosts.findOne({ id: id });
    }),
    postPost: (body) => __awaiter(void 0, void 0, void 0, function* () {
        const findBlogName = yield db_mongo_1.collectionBlogs.findOne({ id: body.blogId });
        if (findBlogName) {
            const createData = {
                id: new Date().getTime().toString(),
                createdAt: new Date().toISOString(),
                blogName: findBlogName.name
            };
            const newPost = Object.assign(Object.assign({}, createData), body);
            yield db_mongo_1.collectionPosts.insertOne(newPost);
            return newPost;
        }
        return undefined;
    }),
    putPost: (body, id) => __awaiter(void 0, void 0, void 0, function* () {
        const findPost = yield db_mongo_1.collectionPosts.findOne({ id: id });
        if (findPost === null)
            return null;
        yield db_mongo_1.collectionPosts.updateOne({ id: id }, {
            $set: {
                title: body.title,
                shortDescription: body.shortDescription,
                content: body.content,
                blogId: body.blogId,
            }
        });
        return true;
    }),
    deletePost: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const deletePost = yield db_mongo_1.collectionPosts.deleteOne({ id: id });
        if (deletePost.deletedCount) {
            return true;
        }
        else
            return null;
    })
};
//# sourceMappingURL=posts-repository.js.map