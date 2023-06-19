import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {usersRepository} from "../../repositories/users-repository";

const loginValidation = body('login').isString().trim().notEmpty().isLength({min:3, max:10}).matches('^[a-zA-Z0-9_-]*$')
    .custom(async login => {
        const checkUser = await usersRepository.findUserByLogin(login)
        if(checkUser === null){
            return true
        } else {
            throw new Error("login already exist")
        }
    })
const passwordValidation = body('password').isString().trim().notEmpty().isLength({min:6, max:20})
const emailValidation = body('email').isString().trim().notEmpty().isEmail()
    .custom(async email => {
    const checkUser = await usersRepository.findUserByEmail(email)
    if(checkUser === null){
        return true
    } else {
        throw new Error("email already exist")
    }
})



export const createUserValidation = [loginValidation, passwordValidation, emailValidation, inputValidationMiddleware]
