import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {collectionUsers} from "../../db/db_mongo";

const emailValidation = body('email').isString().trim().notEmpty().isEmail()
    .custom(async email => {
        const findUser = await collectionUsers.findOne({email: email})
        if (findUser === null || findUser.confirmation.wasConfirm === true) {
            throw new Error("email already exist")
        } else {
            return true
        }
    })

export const emailResendingValidation = [emailValidation, inputValidationMiddleware]
