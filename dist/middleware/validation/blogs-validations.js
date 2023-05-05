"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBlogValidation = exports.createBlogValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("./input-validation-middleware");
const nameValidation = (0, express_validator_1.body)('name').isString().trim().notEmpty().isLength({ max: 15 });
const descriptionValidation = (0, express_validator_1.body)('description').isString().trim().notEmpty().isLength({ max: 500 });
const websiteUrlValidation = (0, express_validator_1.body)('websiteUrl').isString().trim().notEmpty().isURL();
exports.createBlogValidation = [nameValidation, descriptionValidation, websiteUrlValidation, input_validation_middleware_1.inputValidationMiddleware];
exports.updateBlogValidation = [nameValidation, descriptionValidation, input_validation_middleware_1.inputValidationMiddleware];
//# sourceMappingURL=blogs-validations.js.map