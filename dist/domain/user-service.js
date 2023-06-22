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
const crypto_1 = require("crypto");
class UsersServiceClass {
    postUser(login, email, password, confirmAdmin = false) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    confirmationUser(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield users_repository_1.usersRepository.findUserByConfirmationCode(code);
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
            yield users_repository_1.usersRepository.updateConfirmationCodee(code, {
                "confirmation.wasConfirm": true,
                "confirmation.code": null
            });
            return { data: true, errorsMessages: null, isSuccess: true };
        });
    }
    reassignConfirmationCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const findUser = yield users_repository_1.usersRepository.findUserByEmail(email);
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
            yield users_repository_1.usersRepository.updateConfirmationCode(email, uuid);
            return {
                data: uuid,
                isSuccess: true,
                errorsMessages: null
            };
        });
    }
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_repository_1.usersRepository.findUserById(userId);
        });
    }
    recoveryPassword(password, recoveryCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatePassword = yield exports.usersService._generatePasswordHash(password);
            const result = yield users_repository_1.usersRepository.updatePassword(updatePassword, recoveryCode);
            return result.modifiedCount;
        });
    }
    checkUser(loginOrEmail, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield users_repository_1.usersRepository.checkUser(loginOrEmail);
            if (user === null) {
                return null;
            }
            const passwordHash = yield this._generateHash(password, user.salt);
            if (passwordHash !== user.password) {
                return false;
            }
            return user;
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_repository_1.usersRepository.deleteUser(id);
        });
    }
    _generatePasswordHash(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(10);
            const passwordHash = yield this._generateHash(password, salt);
            return { salt, passwordHash };
        });
    }
    _generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, salt);
        });
    }
}
exports.usersService = new UsersServiceClass();
//# sourceMappingURL=user-service.js.map