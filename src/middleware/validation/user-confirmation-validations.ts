import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {collectionUsers} from "../../db/db_mongo";

const codeValidation = body('code').isString().trim().notEmpty().custom(async code => {
    const findUser = await collectionUsers.findOne({'confirmation.code': code})
    if(findUser === null || findUser.findUser.confirmation.wasConfirm === true ){
        throw new Error('confirm code error')
    }
    return true
})


export const registrationConfirmationValidation = [codeValidation, inputValidationMiddleware]
