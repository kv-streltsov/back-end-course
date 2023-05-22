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
exports.usersService = {
    postUser: (login, email, password) => __awaiter(void 0, void 0, void 0, function* () {
        const salt = yield bcrypt_1.default.genSalt(10);
        const passwordHash = yield exports.usersService._generateHash(password, salt);
        const createdUser = {
            login: login,
            email: email,
            salt,
            password: passwordHash,
            id: new Date().getTime().toString(),
            createdAt: new Date().toISOString()
        };
        yield users_repository_1.usersRepository.postUser(Object.assign({}, createdUser));
        return {
            id: createdUser.id,
            login: createdUser.login,
            email: createdUser.email,
            createdAt: createdUser.createdAt
        };
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
        return true;
    }),
    deleteUser: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return yield users_repository_1.usersRepository.deleteUser(id);
    }),
    _generateHash: (password, salt) => __awaiter(void 0, void 0, void 0, function* () {
        return yield bcrypt_1.default.hash(password, salt);
    })
};
//# sourceMappingURL=user-service.js.map