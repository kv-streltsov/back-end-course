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
exports.queryPostsRepository = exports.paginationHandler = void 0;
const db_mongo_1 = require("../db/db_mongo");
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
exports.queryPostsRepository = {
    getAllPosts: (pageNumber = 1, pageSize = 10, sortBy = DEFAULT_SORT_FIELD, sortDirection) => __awaiter(void 0, void 0, void 0, function* () {
        const count = yield db_mongo_1.collectionPosts.countDocuments({});
        const { countItems, sortField } = (0, exports.paginationHandler)(pageNumber, pageSize, sortBy, sortDirection);
        const posts = yield db_mongo_1.collectionPosts.find({}, { projection: { _id: 0 } })
            .skip(countItems)
            .sort(sortField)
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
    getPostById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_mongo_1.collectionPosts.findOne({ id: id }, {
            projection: { _id: 0 },
        });
    })
};
//# sourceMappingURL=query-posts-repository.js.map