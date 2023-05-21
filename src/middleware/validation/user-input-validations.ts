import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";

const loginValidation = body('login').isString().trim().notEmpty().isLength({min:3, max:10}).matches('^[a-zA-Z0-9_-]*$')
const passwordValidation = body('password').isString().trim().notEmpty().isLength({min:6, max:20})
const emailValidation = body('email').isString().trim().notEmpty()



export const createUserValidation = [loginValidation, passwordValidation, emailValidation, inputValidationMiddleware]
