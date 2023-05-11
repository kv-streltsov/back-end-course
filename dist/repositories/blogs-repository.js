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
const db_mongo_1 = require("../db/db_mongo");
exports.blogsRepository = {
    getAllBlogs: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_mongo_1.collectionBlogs.find().toArray();
    }),
    findBlogById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_mongo_1.collectionBlogs.findOne({ id: id });
    }),
    postBlog: (body) => __awaiter(void 0, void 0, void 0, function* () {
        const createData = {
            id: new Date().getTime().toString(),
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        const newBlog = Object.assign(Object.assign({}, createData), body);
        yield db_mongo_1.collectionBlogs.insertOne(newBlog);
        return newBlog;
    }),
    putBlog: (body, id) => __awaiter(void 0, void 0, void 0, function* () {
        const findBlog = yield db_mongo_1.collectionBlogs.findOne({ id: id });
        if (findBlog === null)
            return null;
        // а если сервер не ответит?
        yield db_mongo_1.collectionBlogs.updateOne({ id: id }, {
            $set: {
                name: body.name,
                description: body.description,
                websiteUrl: body.websiteUrl
            }
        });
        return true;
    }),
    deleteBlog: (id) => __awaiter(void 0, void 0, void 0, function* () {
        const deleteBlog = yield db_mongo_1.collectionBlogs.deleteOne({ id: id });
        if (deleteBlog.deletedCount) {
            return true;
        }
        else
            return null;
    })
};
//# sourceMappingURL=blogs-repository.js.map