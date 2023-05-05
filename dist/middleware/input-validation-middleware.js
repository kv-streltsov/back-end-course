"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidationMiddleware = void 0;
const express_validator_1 = require("express-validator");
const inputValidationMiddleware = (req, res, next) => {
    const err = (0, express_validator_1.validationResult)(req);
    let error = {
        "errorsMessages": err.array()
    };
    if (!err.isEmpty())
        res.status(400).send(err);
    else
        next();
};
exports.inputValidationMiddleware = inputValidationMiddleware;
//# sourceMappingURL=input-validation-middleware.js.map