"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.authRouters = exports.COOKIE_SECURE = void 0;
const express_1 = require("express");
const interface_html_code_1 = require("../dto/interface.html-code");
const user_auth_validations_1 = require("../middleware/validation/user-auth-validations");
const jwt_service_1 = require("../application/jwt-service");
const user_service_1 = require("../domain/user-service");
const jwt_auth_middleware_1 = require("../middleware/jwt-auth-middleware");
const user_input_validations_1 = require("../middleware/validation/user-input-validations");
const email_service_1 = require("../domain/email-service");
const refresh_token_middleware_1 = require("../middleware/refresh-token-middleware");
const dotenv = __importStar(require("dotenv"));
const rate_limit_middleware_1 = require("../middleware/rate-limit-middleware");
const password_recovery_validations_1 = require("../middleware/validation/password-recovery-validations");
dotenv.config();
exports.COOKIE_SECURE = process.env.COOKIE_SECURE === null ? false : process.env.COOKIE_SECURE === 'true';
exports.authRouters = (0, express_1.Router)({});
class AuthController {
    ////////////////////////////////////  TOKEN FLOW     /////////////////////////////////////////
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAuth = yield user_service_1.usersService.checkUser(req.body.loginOrEmail, req.body.password);
            if (!userAuth) {
                return res.sendStatus(interface_html_code_1.HttpStatusCode.UNAUTHORIZED);
            }
            if (userAuth) {
                const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
                const jwtPair = yield jwt_service_1.jwtService.createJwt(userAuth, req.headers["user-agent"], ip);
                res.cookie('refreshToken', jwtPair.refreshToken, { httpOnly: true, secure: exports.COOKIE_SECURE });
                return res.status(interface_html_code_1.HttpStatusCode.OK).send({
                    "accessToken": jwtPair.accessToken
                });
            }
            return;
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const result = yield jwt_service_1.jwtService.getSpecifiedDeviceByToken(refreshToken);
            yield jwt_service_1.jwtService.logoutSpecifiedDevice(req.cookies.refreshToken, result.deviceId);
            res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const refreshToken = req.cookies.refreshToken;
            const jwtPair = yield jwt_service_1.jwtService.refreshJwt(req.user, refreshToken);
            res.cookie('refreshToken', jwtPair.refreshToken, { httpOnly: true, secure: exports.COOKIE_SECURE });
            return res.status(interface_html_code_1.HttpStatusCode.OK).send({
                "accessToken": jwtPair.accessToken
            });
        });
    }
    /////////////////////////////////    REGISTRATION FLOW    ///////////////////////////////////
    registration(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdUser = yield user_service_1.usersService.postUser(req.body.login, req.body.email, req.body.password);
            yield email_service_1.emailService.sendMailRegistration(createdUser.createdUser.email, createdUser.uuid);
            res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
        });
    }
    registrationConfirmation(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_service_1.usersService.confirmationUser(req.body.code);
            if (!result.isSuccess) {
                res.status(interface_html_code_1.HttpStatusCode.BAD_REQUEST).send(result.errorsMessages);
                return;
            }
            res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
        });
    }
    registrationEmailResending(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_service_1.usersService.reassignConfirmationCode(req.body.email);
            if (!result.isSuccess) {
                res.status(interface_html_code_1.HttpStatusCode.BAD_REQUEST).json(result.errorsMessages);
                return;
            }
            yield email_service_1.emailService.sendMailRegistration(req.body.email, result.data);
            res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
        });
    }
    passwordRecovery(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield email_service_1.emailService.sendMailPasswordRecovery(req.body.email);
            if (result !== true) {
                res.status(interface_html_code_1.HttpStatusCode.BAD_REQUEST).send(result);
                return;
            }
            res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
        });
    }
    newPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_service_1.usersService.recoveryPassword(req.body.newPassword, req.body.recoveryCode);
            if (!result) {
                res.sendStatus(interface_html_code_1.HttpStatusCode.BAD_REQUEST);
                return;
            }
            res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
        });
    }
    me(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(200).json({
                "email": req.user.email,
                "login": req.user.login,
                "userId": req.user.id
            });
        });
    }
}
const authController = new AuthController();
////////////////////////////////////  TOKEN FLOW     /////////////////////////////////////////
exports.authRouters.post('/login', rate_limit_middleware_1.rateLimitMiddleware, user_auth_validations_1.authUserValidation, authController.login);
exports.authRouters.post('/logout', refresh_token_middleware_1.refreshTokenMiddleware, authController.logout);
exports.authRouters.post('/refresh-token', refresh_token_middleware_1.refreshTokenMiddleware, authController.refreshToken);
/////////////////////////////////    REGISTRATION FLOW    ///////////////////////////////////
exports.authRouters.post('/registration', rate_limit_middleware_1.rateLimitMiddleware, user_input_validations_1.createUserValidation, authController.registration);
exports.authRouters.post('/registration-confirmation', rate_limit_middleware_1.rateLimitMiddleware, authController.registrationConfirmation);
exports.authRouters.post('/registration-email-resending', rate_limit_middleware_1.rateLimitMiddleware, authController.registrationEmailResending);
exports.authRouters.post('/password-recovery', rate_limit_middleware_1.rateLimitMiddleware, authController.passwordRecovery);
exports.authRouters.post('/new-password', rate_limit_middleware_1.rateLimitMiddleware, password_recovery_validations_1.recoveryPasswordValidator, authController.newPassword);
exports.authRouters.get('/me', jwt_auth_middleware_1.authMiddleware, authController.me);
//# sourceMappingURL=auth.routers.js.map