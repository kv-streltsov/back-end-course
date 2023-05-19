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
        // const query1 = {$text: {$search: "va"}};
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
        // return {
        //     "pagesCount": pageNumber,
        //     "page": pageNumber,
        //     "pageSize": pageSize,
        //     "totalCount": pageNumber,
        //     "items": await collectionBlogs
        //         .find(query1, )
        //         .skip((pageNumber - 1) * pageSize)
        //         .limit(pageSize)
        //         .sort(sortBy, sortDirection)
        //         .toArray()
        // }
    }),
    getBlogById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_mongo_1.collectionBlogs.findOne({ id: id }, {
            projection: { _id: 0 },
        });
    }),
    getPostsInBlog: (id, query) => __awaiter(void 0, void 0, void 0, function* () {
        const findBlog = yield db_mongo_1.collectionBlogs.findOne({ id: id });
        if (findBlog === null) {
            return null;
        }
        const searchParams = {
            searchNameTerm: query.searchNameTerm || {},
            sortBy: query.sortBy || 'createdAt',
            sortDirection: query.sortDirection || 'desc',
            pageNumber: query.pageNumber || '1',
            pageSize: query.pageSize || '10'
        };
        const totalCount = (yield db_mongo_1.collectionPosts.countDocuments({ name: query.searchNameTerm })) - 1;
        return {
            "pagesCount": Math.ceil(totalCount / Number(searchParams.pageSize)),
            "page": Number(searchParams.pageNumber),
            "pageSize": Number(searchParams.pageSize),
            "totalCount": totalCount,
            "items": yield db_mongo_1.collectionPosts
                .find({}, { projection: { _id: 0 }, })
                .skip((Number(searchParams.pageNumber) - 1) * Number(searchParams.pageSize))
                .limit(Number(query.pageSize))
                .sort(searchParams.sortBy, searchParams.sortDirection)
                .toArray()
        };
    }),
};
//# sourceMappingURL=query-blogs-repository.js.map