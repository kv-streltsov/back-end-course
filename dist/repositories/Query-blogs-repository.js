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
        return yield db_mongo_1.collectionBlogs
            .find({ name: query.searchNameTerm }, { projection: { _id: 0 }, })
            .skip((Number(query.pageNumber) - 1) * Number(query.pageSize))
            .limit(Number(query.pageSize))
            .sort(query.sortBy, query.sortDirection)
            .toArray();
    }),
    getBlogById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_mongo_1.collectionBlogs.findOne({ id: id }, {
            projection: { _id: 0 },
        });
    }),
};
//# sourceMappingURL=query-blogs-repository.js.map