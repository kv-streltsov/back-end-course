"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommentValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("./input-validation-middleware");
const contentValidation = (0, express_validator_1.body)('content').isString().trim().notEmpty().isLength({ min: 20, max: 300 });
exports.createCommentValidation = [contentValidation, input_validation_middleware_1.inputValidationMiddleware];
//# sourceMappingURL=comments-validations.js.map