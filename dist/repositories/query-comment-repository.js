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
exports.queryCommentRepository = exports.paginationHandler = void 0;
const comments_scheme_1 = require("../db/schemes/comments.scheme");
const DEFAULT_SORT_FIELD = 'createdAt';
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
exports.queryCommentRepository = {
    getCommentsByPostId: (postId, pageNumber = 1, pageSize = 10, sortDirection, sortBy = DEFAULT_SORT_FIELD) => __awaiter(void 0, void 0, void 0, function* () {
        const count = yield comments_scheme_1.commentsModel.countDocuments({ postId: postId });
        if (count === 0) {
            return null;
        }
        const { countItems, sortField } = (0, exports.paginationHandler)(pageNumber, pageSize, sortBy, sortDirection);
        const comments = yield comments_scheme_1.commentsModel.find({ postId: postId }, { projection: { _id: 0, postId: 0 } })
            .skip(countItems)
            .sort(sortField)
            .limit(pageSize)
            .lean();
        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: comments
        };
    }),
    getCommentById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return comments_scheme_1.commentsModel.findOne({ id: id }, { projection: { _id: 0, postId: 0 },
        });
    })
};
//# sourceMappingURL=query-comment-repository.js.map