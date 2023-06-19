import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";


const passwordValidation = body('newPassword').isString().trim().notEmpty().isLength({min:6, max:20})
const recoveryCode = body('recoveryCode').isString().trim().notEmpty().isLength({min:6, max:6})


export const recoveryPasswordValidator = [passwordValidation, recoveryCode, inputValidationMiddleware]
