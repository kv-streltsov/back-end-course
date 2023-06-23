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
const posts_scheme_1 = require("../db/schemes/posts.scheme");
const blogs_scheme_1 = require("../db/schemes/blogs.scheme");
const DEFAULT_SORT_FIELD = 'createdAt';
const PROJECTION = { _id: 0, __v: 0 };
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
class QueryBlogsRepositoryClass {
    getAllBlogs(pageNumber = 1, pageSize = 10, sortDirection, sortBy = DEFAULT_SORT_FIELD, searchNameTerm = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const { countItems, sortField } = (0, exports.paginationHandler)(pageNumber, pageSize, sortBy, sortDirection);
            const findNameTerm = searchNameTerm ? { name: { $regex: searchNameTerm, $options: 'i' } } : {};
            const count = yield blogs_scheme_1.blogsModel.countDocuments(findNameTerm);
            const blogs = yield blogs_scheme_1.blogsModel.find(findNameTerm)
                .select(PROJECTION)
                .sort(sortField)
                .skip(countItems)
                .limit(pageSize)
                .lean();
            return {
                pagesCount: Math.ceil(count / pageSize),
                page: pageNumber,
                pageSize,
                totalCount: count,
                items: blogs
            };
        });
    }
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return blogs_scheme_1.blogsModel.findOne({ id: id }).select(PROJECTION);
        });
    }
    getPostsInBlog(pageNumber = 1, pageSize = 10, sortDirection, sortBy = DEFAULT_SORT_FIELD, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const findBlog = yield blogs_scheme_1.blogsModel.findOne({ id: id });
            if (findBlog === null) {
                return null;
            }
            const count = yield posts_scheme_1.postsModel.countDocuments({ blogId: id });
            const { countItems, sortField } = (0, exports.paginationHandler)(pageNumber, pageSize, sortBy, sortDirection);
            const posts = yield posts_scheme_1.postsModel.find({ blogId: id })
                .select(PROJECTION)
                .sort(sortField)
                .skip(countItems)
                .limit(pageSize)
                .lean();
            return {
                pagesCount: Math.ceil(count / pageSize),
                page: pageNumber,
                pageSize,
                totalCount: count,
                items: posts
            };
        });
    }
}
exports.queryBlogsRepository = new QueryBlogsRepositoryClass;
//# sourceMappingURL=query-blogs-repository.js.map