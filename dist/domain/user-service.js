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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersService = void 0;
const users_repository_1 = require("../repositories/users-repository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_mongo_1 = require("../db/db_mongo");
const crypto_1 = require("crypto");
exports.usersService = {
    postUser: (login, email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(10);
        const passwordHash = yield exports.usersService._generateHash(password, salt);
        const uuid = (0, crypto_1.randomUUID)();
        const createdUser = {
            login: login,
            email: email,
            confirmation: {
                code: uuid,
                wasConfirm: false
            },
            salt,
            password: passwordHash,
            id: new Date().getTime().toString(),
            createdAt: new Date().toISOString()
        };
        yield users_repository_1.usersRepository.postUser(Object.assign({}, createdUser));
        return ({ createdUser: {
                id: createdUser.id,
                login: createdUser.login,
                email: createdUser.email,
                createdAt: createdUser.createdAt
            }, uuid });
    }),
    confirmationUser: (code) => __awaiter(void 0, void 0, void 0, function* () {
        const findUser = yield db_mongo_1.collectionUsers.findOne({ 'confirmation.code': code });
        if (findUser === null) {
            return null;
        }
        yield db_mongo_1.collectionUsers.updateOne({ 'confirmation.code': code }, { $set: { "confirmation.wasConfirm": true } });
        return true;
    }),
    getUserById: (userId) => __awaiter(void 0, void 0, void 0, function* () {
        return yield db_mongo_1.collectionUsers.findOne({ id: userId });
    }),
    checkUser: (loginOrEmail, password) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield users_repository_1.usersRepository.checkUser(loginOrEmail);
        if (user === null) {
            return null;
        }
        const passwordHash = yield exports.usersService._generateHash(password, user.salt);
        if (passwordHash !== user.password) {
            return false;
        }
        return user;
    }),
    deleteUser: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield users_repository_1.usersRepository.deleteUser(id);
    }),
    _generateHash: (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
        return yield bcrypt_1.default.hash(password, salt);
    })
};
//# sourceMappingURL=user-service.js.map