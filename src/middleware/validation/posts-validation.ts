import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";

const titleValidation = body('title').isString().trim().notEmpty().isLength({max:30})
const shortDescriptionValidation = body('shortDescription').isString().trim().notEmpty().isLength({max:100})
const content = body('content').isString().trim().notEmpty().isLength({max:1000})
const blogId = body('blogId').isString().trim().notEmpty()

export const createPostValidation = [titleValidation, shortDescriptionValidation, content, blogId, inputValidationMiddleware]
export const updatePostValidation = [titleValidation, shortDescriptionValidation, content, blogId, inputValidationMiddleware]


// h02.db.PostInputModel{
//     title*	string
//     maxLength: 30

//     shortDescription*	string
//     maxLength: 100

//     content*	string
//     maxLength: 1000

//     blogId*	string
// }