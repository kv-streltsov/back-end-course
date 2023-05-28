import {body, param} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";

const contentValidation = body('content').isString().trim().notEmpty().isLength({min: 20, max: 300})

export const createCommentValidation = [contentValidation, inputValidationMiddleware]
