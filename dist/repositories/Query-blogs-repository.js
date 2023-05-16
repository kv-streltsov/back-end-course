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
exports.queryBlogsRepository = void 0;
const db_mongo_1 = require("../db/db_mongo");
exports.queryBlogsRepository = {
    getAllBlogs: (query) => __awaiter(void 0, void 0, void 0, function* () {
        const searchParams = {
            searchNameTerm: query.searchNameTerm || {},
            sortBy: query.sortBy || 'createdAt',
            sortDirection: query.sortDirection || 'desc',
            pageNumber: query.pageNumber || '1',
            pageSize: query.pageSize || '10'
        };
        return {
            "pagesCount": Number(searchParams.pageNumber),
            "page": Number(searchParams.pageNumber),
            "pageSize": Number(searchParams.pageSize),
            "totalCount": Number(searchParams.pageNumber),
            "items": yield db_mongo_1.collectionBlogs
                .find({ name: query.searchNameTerm }, { projection: { _id: 0 }, })
                .skip((Number(searchParams.pageNumber) - 1) * Number(searchParams.pageSize))
                .limit(Number(query.pageSize))
                .sort(searchParams.sortBy, searchParams.sortDirection)
                .toArray()
        };
    }),
    getBlogById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_mongo_1.collectionBlogs.findOne({ id: id }, {
            projection: { _id: 0 },
        });
    }),
    getPostsInBlog: (id, query) => __awaiter(void 0, void 0, void 0, function* () {
        const searchParams = {
            searchNameTerm: query.searchNameTerm || {},
            sortBy: query.sortBy || 'createdAt',
            sortDirection: query.sortDirection || 'desc',
            pageNumber: query.pageNumber || '1',
            pageSize: query.pageSize || '10'
        };
        return {
            "pagesCount": Number(searchParams.pageNumber),
            "page": Number(searchParams.pageNumber),
            "pageSize": Number(searchParams.pageSize),
            "totalCount": Number(searchParams.pageNumber),
            "items": yield db_mongo_1.collectionPosts
                .find({ name: query.searchNameTerm }, { projection: { _id: 0 }, })
                .skip((Number(searchParams.pageNumber) - 1) * Number(searchParams.pageSize))
                .limit(Number(query.pageSize))
                .sort(searchParams.sortBy, searchParams.sortDirection)
                .toArray()
        };
    }),
};
//# sourceMappingURL=query-blogs-repository.js.map