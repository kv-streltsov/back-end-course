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
exports.userRouters = void 0;
const express_1 = require("express");
const basic_auth_middleware_1 = require("../middleware/basic-auth-middleware");
const user_input_validations_1 = require("../middleware/validation/user-input-validations");
const user_service_1 = require("../domain/user-service");
const interface_html_code_1 = require("../dto/interface.html-code");
const interface_pagination_1 = require("../dto/interface.pagination");
const query_users_repository_1 = require("../repositories/query-users-repository");
exports.userRouters = (0, express_1.Router)({});
exports.userRouters.get('/', basic_auth_middleware_1.basic_auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield query_users_repository_1.queryUsersRepository.getAllUsers(req.query.pageSize && Number(req.query.pageSize), req.query.pageNumber && Number(req.query.pageNumber), req.query.sortBy, req.query.sortDirection === 'asc' ? interface_pagination_1.SortType.asc : interface_pagination_1.SortType.desc, req.query.searchEmailTerm, req.query.searchLoginTerm);
    res.status(interface_html_code_1.HttpStatusCode.OK).send(allUsers);
}));
exports.userRouters.post('/', basic_auth_middleware_1.basic_auth, user_input_validations_1.createUserValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newUser = yield user_service_1.usersService.postUser(req.body);
    res.status(interface_html_code_1.HttpStatusCode.CREATED).send(newUser);
}));
exports.userRouters.delete('/:id', basic_auth_middleware_1.basic_auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedUser = yield user_service_1.usersService.deleteUser(req.params.id);
    if (deletedUser.deletedCount === 1) {
        res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
    }
    else {
        res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
    }
}));
//# sourceMappingURL=user.routers.js.map