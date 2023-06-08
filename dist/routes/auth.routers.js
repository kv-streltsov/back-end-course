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
const jwt_auth_middleware_1 = require("../middleware/jwt-auth-middleware");
const user_input_validations_1 = require("../middleware/validation/user-input-validations");
const email_service_1 = require("../domain/email-service");
exports.authRouters = (0, express_1.Router)({});
exports.authRouters.post('/login', user_auth_validations_1.authUserValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuth = yield user_service_1.usersService.checkUser(req.body.loginOrEmail, req.body.password);
    if (userAuth === null || userAuth === false) {
        res.sendStatus(interface_html_code_1.HttpStatusCode.UNAUTHORIZED);
    }
    if (userAuth) {
        const token = yield jwt_service_1.jwtService.createJwt(userAuth);
        res.cookie('refreshToken', token.refreshToken, { httpOnly: true, secure: true });
        res.status(interface_html_code_1.HttpStatusCode.OK).send({
            "accessToken": token.accessToken
        });
    }
}));
exports.authRouters.post('/registration', user_input_validations_1.createUserValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdUser = yield user_service_1.usersService.postUser(req.body.login, req.body.email, req.body.password);
    yield email_service_1.emailService.sendMailRegistration(createdUser.createdUser.email, createdUser.uuid);
    res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
}));
exports.authRouters.post('/registration-confirmation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.usersService.confirmationUser(req.body.code);
    if (!result.isSuccess) {
        res.status(interface_html_code_1.HttpStatusCode.BAD_REQUEST).send(result.errorsMessages);
        return;
    }
    res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
}));
exports.authRouters.post('/registration-email-resending', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.usersService.reassignConfirmationCode(req.body.email);
    if (!result.isSuccess) {
        res.status(interface_html_code_1.HttpStatusCode.BAD_REQUEST).json(result.errorsMessages);
        return;
    }
    yield email_service_1.emailService.sendMailRegistration(req.body.email, result.data);
    res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
}));
exports.authRouters.post('/refresh-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies;
    console.log(refreshToken);
    const jwtPair = yield jwt_service_1.jwtService.refreshJwtPair(refreshToken);
    console.log(jwtPair);
    if (!jwtPair) {
        res.sendStatus(interface_html_code_1.HttpStatusCode.UNAUTHORIZED);
        return;
    }
    res.cookie('refresh_token', jwtPair.refreshToken, { httpOnly: true, secure: true });
    res.status(interface_html_code_1.HttpStatusCode.OK).send({
        "accessToken": jwtPair.accessToken
    });
}));
exports.authRouters.get('/me', jwt_auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = {
        "email": req.user.email,
        "login": req.user.login,
        "userId": req.user.id
    };
    res.status(200).send(user);
}));
//# sourceMappingURL=auth.routers.js.map