"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUserValidation = void 0;
const express_validator_1 = require("express-validator");
const input_validation_middleware_1 = require("./input-validation-middleware");
const loginValidation = (0, express_validator_1.body)('loginOrEmail').isString().trim().notEmpty().custom(loginOrEmail => {
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (loginOrEmail.length < 3) {
        throw new Error('error length');
    }
    if (!loginOrEmail.match('^[a-zA-Z0-9_-]*$') && !loginOrEmail.match(regexEmail)) {
        throw new Error('error match');
    }
    return true;
});
// throw new Error('id not found in blog')
//.isLength({min:3, max:10})
//.matches()
const passwordValidation = (0, express_validator_1.body)('password').isString().trim().notEmpty().isLength({ min: 6, max: 20 });
exports.authUserValidation = [loginValidation, passwordValidation, input_validation_middleware_1.inputValidationMiddleware];
//# sourceMappingURL=user-auth-validations.js.map