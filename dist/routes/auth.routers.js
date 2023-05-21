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
const user_input_validations_1 = require("../middleware/validation/user-input-validations");
exports.authRouters = (0, express_1.Router)({});
exports.authRouters.post('/login', basic_auth_middleware_1.basic_auth, user_input_validations_1.createUserValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
}));
//# sourceMappingURL=auth.routers.js.map