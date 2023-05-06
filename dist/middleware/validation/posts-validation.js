"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePostValidation = exports.createPostValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("./input-validation-middleware");
const db_1 = require("../../db/db");
const titleValidation = (0, express_validator_1.body)('title').isString().trim().notEmpty().isLength({ max: 30 });
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription').isString().trim().notEmpty().isLength({ max: 100 });
const contentValidation = (0, express_validator_1.body)('content').isString().trim().notEmpty().isLength({ max: 1000 });
const blogIdValidation = (0, express_validator_1.body)('blogId').isString().trim().notEmpty().custom(blogId => {
    const checkBlogId = db_1.blogs_list.findIndex(value => value.id === blogId);
    if (checkBlogId === -1) {
        throw new Error('id not found in blog');
    }
    return true;
});
// .custom(blogId => {
//
//     const findPostId: number = posts_list.findIndex(value => value.blogId === blogId)
//     if (findPostId !== -1) {throw new Error('blogId already in use')}
//     return true
//
// })
exports.createPostValidation = [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware];
exports.updatePostValidation = [titleValidation, shortDescriptionValidation, contentValidation, input_validation_middleware_1.inputValidationMiddleware];
//# sourceMappingURL=posts-validation.js.map