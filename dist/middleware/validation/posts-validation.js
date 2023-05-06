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
// h02.db.PostInputModel{
//     title*	string
//     maxLength: 30
//     shortDescription*	string
//     maxLength: 100
//     content*	string
//     maxLength: 1000
//     blogId*	string
// }
//# sourceMappingURL=posts-validation.js.map