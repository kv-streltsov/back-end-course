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
exports.QueryUsersRepositoryClass = exports.paginationHandler = void 0;
const users_scheme_1 = require("../db/schemes/users.scheme");
const DEFAULT_SORT_FIELD = 'createdAt';
const paginationHandler = (pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm) => {
    const countItems = (pageNumber - 1) * pageSize;
    let sortField = {};
    sortField[sortBy] = sortDirection;
    let searchTerm = {};
    if (searchEmailTerm === null && searchLoginTerm === null) {
        searchTerm = {};
    }
    else if (searchLoginTerm === null && searchEmailTerm !== null) {
        searchTerm = { email: { $regex: searchEmailTerm, $options: 'i' } };
    }
    else if (searchEmailTerm === null && searchLoginTerm !== null) {
        searchTerm = { login: { $regex: searchLoginTerm, $options: 'i' } };
    }
    else if (searchEmailTerm !== null && searchLoginTerm !== null) {
        searchTerm = {
            $or: [
                { email: { $regex: searchEmailTerm, $options: 'i' } },
                { login: { $regex: searchLoginTerm, $options: 'i' } }
            ]
        };
    }
    return {
        countItems,
        sortField,
        searchTerm
    };
};
exports.paginationHandler = paginationHandler;
class QueryUsersRepositoryClass {
    getAllUsers(pageSize = 10, pageNumber = 1, sortBy = DEFAULT_SORT_FIELD, sortDirection, searchEmailTerm = null, searchLoginTerm = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const { countItems, sortField, searchTerm } = (0, exports.paginationHandler)(pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm);
            const count = yield users_scheme_1.usersModel.countDocuments(searchTerm);
            const users = yield users_scheme_1.usersModel
                .find(searchTerm)
                .select({ _id: 0, password: 0, salt: 0, confirmation: 0, __v: 0 })
                .sort(sortField)
                .skip(countItems)
                .limit(pageSize)
                .lean();
            return {
                pagesCount: Math.ceil(count / pageSize),
                page: pageNumber,
                pageSize,
                totalCount: count,
                items: users
            };
        });
    }
}
exports.QueryUsersRepositoryClass = QueryUsersRepositoryClass;
//# sourceMappingURL=query-users-repository.js.map