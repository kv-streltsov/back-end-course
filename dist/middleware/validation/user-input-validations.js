"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("./input-validation-middleware");
const loginValidation = (0, express_validator_1.body)('login').isString().trim().notEmpty().isLength({ min: 3, max: 10 }).matches('^[a-zA-Z0-9_-]*$');
const passwordValidation = (0, express_validator_1.body)('password').isString().trim().notEmpty().isLength({ min: 6, max: 20 });
const emailValidation = (0, express_validator_1.body)('email').isString().trim().notEmpty();
exports.createUserValidation = [loginValidation, passwordValidation, emailValidation, input_validation_middleware_1.inputValidationMiddleware];
//# sourceMappingURL=user-input-validations.js.map