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
exports.updatePostValidation = exports.createPostValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("./input-validation-middleware");
const db_mongo_1 = require("../../db/db_mongo");
const titleValidation = (0, express_validator_1.body)('title').isString().trim().notEmpty().isLength({ max: 30 });
const shortDescriptionValidation = (0, express_validator_1.body)('shortDescription').isString().trim().notEmpty().isLength({ max: 100 });
const contentValidation = (0, express_validator_1.body)('content').isString().trim().notEmpty().isLength({ max: 1000 });
const blogIdValidation = (0, express_validator_1.body)('blogId').isString().trim().notEmpty().custom((blogId) => __awaiter(void 0, void 0, void 0, function* () {
    const findBlog = yield db_mongo_1.collectionBlogs.findOne({ id: blogId });
    if (!findBlog) {
        throw new Error('id not found in blog');
    }
    return true;
}));
exports.createPostValidation = [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware];
exports.updatePostValidation = [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, input_validation_middleware_1.inputValidationMiddleware];
//# sourceMappingURL=posts-validation.js.map