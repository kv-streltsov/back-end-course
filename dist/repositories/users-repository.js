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
exports.usersRepository = void 0;
const users_scheme_1 = require("../db/schemes/users.scheme");
exports.usersRepository = {
    postUser: (createdUser) => __awaiter(void 0, void 0, void 0, function* () {
        return yield users_scheme_1.usersModel.create(createdUser);
    }),
    checkUser: (loginOrEmail) => __awaiter(void 0, void 0, void 0, function* () {
        return yield users_scheme_1.usersModel.findOne({ $or: [{ email: loginOrEmail }, { login: loginOrEmail }] });
    }),
    updateRecoveryCode: (email, recoveryCode) => __awaiter(void 0, void 0, void 0, function* () {
        yield users_scheme_1.usersModel.updateOne({ email: email }, { $set: { "confirmation.passwordRecoveryCode": recoveryCode } });
    }),
    updateConfirmationCode: (email, uuid) => __awaiter(void 0, void 0, void 0, function* () {
        return users_scheme_1.usersModel.updateOne({ email: email }, { $set: { "confirmation.code": uuid } });
    }),
    updateConfirmationCodee: (code, pyload) => __awaiter(void 0, void 0, void 0, function* () {
        return users_scheme_1.usersModel.updateOne({ 'confirmation.code': code }, { $set: pyload });
    }),
    findUserById: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return users_scheme_1.usersModel.findOne({ id: id }).lean();
    }),
    findUserByLogin: (login) => __awaiter(void 0, void 0, void 0, function* () {
        return users_scheme_1.usersModel.findOne({ login: login }).lean();
    }),
    findUserByEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        return users_scheme_1.usersModel.findOne({ email: email }).lean();
    }),
    findUserByConfirmationCode: (code) => __awaiter(void 0, void 0, void 0, function* () {
        return users_scheme_1.usersModel.findOne({ 'confirmation.code': code }).lean();
    }),
    deleteUser: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return users_scheme_1.usersModel.deleteOne({ id: id });
    })
};
//# sourceMappingURL=users-repository.js.map