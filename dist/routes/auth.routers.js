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
const basic_auth_middleware_1 = require("../middleware/basic-auth-middleware");
const auth_service_1 = require("../domain/auth-service");
const interface_html_code_1 = require("../dto/interface.html-code");
exports.authRouters = (0, express_1.Router)({});
exports.authRouters.post('/login', basic_auth_middleware_1.basic_auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userAuth = yield auth_service_1.authService.checkUser(req.body.loginOrEmail, req.body.password);
    console.log(userAuth);
    if (userAuth) {
        res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
    }
    if (userAuth === null) {
        res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
    }
    res.sendStatus(interface_html_code_1.HttpStatusCode.UNAUTHORIZED);
}));
//# sourceMappingURL=auth.routers.js.map