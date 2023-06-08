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
    postUser: (login, email, password, confirmAdmin = false) => __awaiter(void 0, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(10);
        const passwordHash = yield exports.usersService._generateHash(password, salt);
        const uuid = (0, crypto_1.randomUUID)(); //
        const createdUser = {
            login: login,
            email: email,
            confirmation: {
                code: uuid,
                wasConfirm: confirmAdmin
            },
            salt,
            password: passwordHash,
            id: (0, crypto_1.randomUUID)(),
            createdAt: new Date().toISOString()
        };
        yield users_repository_1.usersRepository.postUser(Object.assign({}, createdUser));
        return ({
            createdUser: {
                id: createdUser.id,
                login: createdUser.login,
                email: createdUser.email,
                createdAt: createdUser.createdAt
            }, uuid
        });
    }),
    confirmationUser: (code) => __awaiter(void 0, void 0, void 0, function* () {
        const findUser = yield db_mongo_1.collectionUsers.findOne({ 'confirmation.code': code });
        if (findUser === null || findUser.confirmation.wasConfirm === true) {
            return {
                data: null,
                "errorsMessages": [
                    {
                        "message": "confirm code error",
                        "field": "code"
                    }
                ],
                isSuccess: false
            };
        }
        yield db_mongo_1.collectionUsers.updateOne({ 'confirmation.code': code }, {
            $set: {
                "confirmation.wasConfirm": true,
                "confirmation.code": null
            }
        });
        return { data: true, errorsMessages: null, isSuccess: true };
    }),
    reassignConfirmationCode: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const findUser = yield db_mongo_1.collectionUsers.findOne({ email: email });
        if (findUser === null || findUser.confirmation.wasConfirm === true) {
            return {
                isSuccess: false,
                errorsMessages: [
                    {
                        message: "email already exist or confirmed",
                        field: "email"
                    }
                ],
                data: null
            };
        }
        const uuid = (0, crypto_1.randomUUID)();
        yield db_mongo_1.collectionUsers.updateOne({ email: email }, { $set: { "confirmation.code": uuid } });
        return {
            data: uuid,
            isSuccess: true,
            errorsMessages: null
        };
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