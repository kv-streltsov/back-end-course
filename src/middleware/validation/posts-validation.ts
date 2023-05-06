import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {posts_list} from "../../db/db";

const titleValidation = body('title').isString().trim().notEmpty().isLength({max: 30})
const shortDescriptionValidation = body('shortDescription').isString().trim().notEmpty().isLength({max: 100})
const contentValidation = body('content').isString().trim().notEmpty().isLength({max: 1000})

const blogIdValidation = body('blogId').isString().trim().notEmpty()
    .custom(blogId => {
        const findBlogId: number = posts_list.findIndex(value => value.blogId === blogId)
        if (findBlogId !== -1) {
            throw new Error('blogId already in use')
        }
        return true
    })


export const createPostValidation =
    [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware]
export const updatePostValidation =
    [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware]