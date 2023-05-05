"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBlogValidation = exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const nameValidation = (0, express_validator_1.body)('name').isString().trim().notEmpty().isLength({ max: 15 });
const descriptionValidation = (0, express_validator_1.body)('name').isString().trim().notEmpty().isLength({ max: 15 });
const inputValidationMiddleware = (req, res, next) => {
    (0, express_validator_1.body)('name').isString().trim().notEmpty().isLength({ max: 15 });
    const err = (0, express_validator_1.validationResult)(req);
    if (!err.isEmpty()) {
        const errorsMessages = err.array({ onlyFirstError: true }).map((e) => ({ message: e.msg, field: e.path }));
        return res.status(400).send({ errorsMessages });
    }
    return next();
};
exports.inputValidationMiddleware = inputValidationMiddleware;
exports.createBlogValidation = [nameValidation, descriptionValidation, exports.inputValidationMiddleware];
// h02.db.BlogInputModel{
//     name*	string
//     maxLength: 15
//     description*	string
//     maxLength: 500
//     websiteUrl*	string
//     maxLength: 100
//     pattern: ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
//         }
//# sourceMappingURL=input-validation-middleware.js.map