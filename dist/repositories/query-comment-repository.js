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
exports.QueryCommentRepositoryClass = exports.paginationHandler = void 0;
const comments_scheme_1 = require("../db/schemes/comments.scheme");
const query_like_status_repository_1 = require("./query-like-status-repository");
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
class QueryCommentRepositoryClass {
    constructor() {
        this.queryLikeStatusRepository = new query_like_status_repository_1.QueryLikeStatusRepositoryClass;
    }
    getCommentsByPostId(postId, pageNumber = 1, pageSize = 10, sortDirection, sortBy = DEFAULT_SORT_FIELD) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield comments_scheme_1.commentsModel.countDocuments({ postId: postId });
            if (count === 0) {
                return null;
            }
            const { countItems, sortField } = (0, exports.paginationHandler)(pageNumber, pageSize, sortBy, sortDirection);
            const comments = yield comments_scheme_1.commentsModel.find({ postId: postId })
                .select(PROJECTION)
                .skip(countItems)
                .sort(sortField)
                .limit(pageSize)
                .lean();
            const items = yield Promise.all(comments.map((comment) => __awaiter(this, void 0, void 0, function* () {
                const likesInfo = yield this.queryLikeStatusRepository.getLikesInfo(comment.commentatorInfo.userId, comment.id);
                return Object.assign(Object.assign({}, comment), { likesInfo: likesInfo });
            })));
            return {
                pagesCount: Math.ceil(count / pageSize),
                page: pageNumber,
                pageSize,
                totalCount: count,
                items: items
            };
        });
    }
    getCommentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return comments_scheme_1.commentsModel.findOne({ id: id }).select(PROJECTION).lean();
        });
    }
}
exports.QueryCommentRepositoryClass = QueryCommentRepositoryClass;
//# sourceMappingURL=query-comment-repository.js.map