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
exports.authRouters = void 0;
const express_1 = require("express");
const interface_html_code_1 = require("../dto/interface.html-code");
const user_auth_validations_1 = require("../middleware/validation/user-auth-validations");
const jwt_service_1 = require("../application/jwt-service");
const user_service_1 = require("../domain/user-service");
exports.authRouters = (0, express_1.Router)({});
exports.authRouters.post('/login', user_auth_validations_1.authUserValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuth = yield user_service_1.usersService.checkUser(req.body.loginOrEmail, req.body.password);
    if (userAuth === null || userAuth === false) {
        res.sendStatus(interface_html_code_1.HttpStatusCode.UNAUTHORIZED);
    }
    if (userAuth) {
        const token = yield jwt_service_1.jwtService.createJwt(userAuth);
        res.status(interface_html_code_1.HttpStatusCode.OK).send(token);
    }
}));
//# sourceMappingURL=auth.routers.js.map