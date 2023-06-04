import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {log} from "util";
import {collectionUsers} from "../../db/db_mongo";

const loginValidation = body('login').isString().trim().notEmpty().isLength({min:3, max:10}).matches('^[a-zA-Z0-9_-]*$')
    .custom(async login => {
        const checkUser = await collectionUsers.findOne({login: login})
        if(checkUser === null){
            return true
        } else {
            throw new Error("login already exist")
        }
    })
const passwordValidation = body('password').isString().trim().notEmpty().isLength({min:6, max:20})
const emailValidation = body('email').isString().trim().notEmpty().isEmail()
    .custom(async email => {
    const checkUser = await collectionUsers.findOne({email: email})
    if(checkUser === null){
        return true
    } else {
        throw new Error("email already exist")
    }
})



export const createUserValidation = [loginValidation, passwordValidation, emailValidation, inputValidationMiddleware]
