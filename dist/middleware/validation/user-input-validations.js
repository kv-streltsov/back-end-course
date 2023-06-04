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
exports.createUserValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("./input-validation-middleware");
const db_mongo_1 = require("../../db/db_mongo");
const loginValidation = (0, express_validator_1.body)('login').isString().trim().notEmpty().isLength({ min: 3, max: 10 }).matches('^[a-zA-Z0-9_-]*$')
    .custom((login) => __awaiter(void 0, void 0, void 0, function* () {
    const checkUser = yield db_mongo_1.collectionUsers.findOne({ login: login });
    if (checkUser === null) {
        return true;
    }
    else {
        throw new Error("login already exist");
    }
}));
const passwordValidation = (0, express_validator_1.body)('password').isString().trim().notEmpty().isLength({ min: 6, max: 20 });
const emailValidation = (0, express_validator_1.body)('email').isString().trim().notEmpty().isEmail()
    .custom((email) => __awaiter(void 0, void 0, void 0, function* () {
    const checkUser = yield db_mongo_1.collectionUsers.findOne({ email: email });
    if (checkUser === null) {
        return true;
    }
    else {
        throw new Error("email already exist");
    }
}));
exports.createUserValidation = [loginValidation, passwordValidation, emailValidation, input_validation_middleware_1.inputValidationMiddleware];
//# sourceMappingURL=user-input-validations.js.map