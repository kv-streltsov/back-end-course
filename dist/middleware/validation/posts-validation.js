"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostValidation = exports.createPostValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("./input-validation-middleware");
const titleValidation = (0, express_validator_1.body)('title').isString().trim().notEmpty().isLength({ max: 30 });
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription').isString().trim().notEmpty().isLength({ max: 100 });
const content = (0, express_validator_1.body)('content').isString().trim().notEmpty().isLength({ max: 1000 });
const blogId = (0, express_validator_1.body)('blogId').isString().trim().notEmpty();
exports.createPostValidation = [titleValidation, shortDescriptionValidation, content, blogId, input_validation_middleware_1.inputValidationMiddleware];
exports.updatePostValidation = [titleValidation, shortDescriptionValidation, content, blogId, input_validation_middleware_1.inputValidationMiddleware];
//# sourceMappingURL=posts-validation.js.map