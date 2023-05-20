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
exports.queryBlogsRepository = exports.paginationHandler = void 0;
const db_mongo_1 = require("../db/db_mongo");
const DEFAULT_SORT_FIELD = 'crceatedAt';
const paginationHandler = (pageNumber, pageSize, sortBy, sortDirection) => {
    const countItems = (pageNumber - 1) * pageSize;
    let sortField = {};
    sortField[sortBy] = sortDirection;
    return {
        countItems,
        sortField
    };
};
exports.paginationHandler = paginationHandler;
exports.queryBlogsRepository = {
    getAllBlogs: (pageNumber = 1, pageSize = 10, sortDirectioen, sortBy = DEFAULT_SORT_FIELD, searchNameTerm = null) => __awaiter(void 0, void 0, void 0, function* () {
        const { countItems, sortField } = (0, exports.paginationHandler)(pageNumber, pageSize, sortBy, sortDirectioen);
        const findNameTerm = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};
        const count = yield db_mongo_1.collectionBlogs.countDocuments(findNameTerm);
        const blogs = yield db_mongo_1.collectionBlogs.find(findNameTerm, { projection: { _id: 0 } })
            .sort(sortField)
            .skip(countItems)
            .limit(pageSize)
            .toArray();
        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: blogs
        };
    }),
    getBlogById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_mongo_1.collectionBlogs.findOne({ id: id }, {
            projection: { _id: 0 },
        });
    }),
    getPostsInBlog: (pageNumber = 1, pageSize = 10, sortDirectioen, sortBy = 'desc', id) => __awaiter(void 0, void 0, void 0, function* () {
        const findBlog = yield db_mongo_1.collectionBlogs.findOne({ id: id });
        if (findBlog === null) {
            return null;
        }
        const count = yield db_mongo_1.collectionPosts.countDocuments({ blogId: id });
        const { countItems, sortField } = (0, exports.paginationHandler)(pageNumber, pageSize, sortBy, sortDirectioen);
        const posts = yield db_mongo_1.collectionPosts.find({ blogId: id }, { projection: { _id: 0 } })
            .sort(sortBy)
            .skip(countItems)
            .limit(pageSize)
            .toArray();
        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: posts
        };
    }),
};
//# sourceMappingURL=query-blogs-repository.js.map