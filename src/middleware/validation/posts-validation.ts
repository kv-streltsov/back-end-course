import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {blogsModel} from "../../db/schemes/blogs.scheme";

const titleValidation = body('title').isString().trim().notEmpty().isLength({max: 30})
const shortDescriptionValidation = body('shortDescription').isString().trim().notEmpty().isLength({max: 100})
const contentValidation = body('content').isString().trim().notEmpty().isLength({max: 1000})
const blogIdValidation = body('blogId').isString().trim().notEmpty().custom(async blogId => {

    const findBlog = await blogsModel.findOne({id: blogId})
    if (!findBlog) {
        throw new Error('id not found in blog')
    }
    return true

})


export const createPostValidation =
    [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware]

export const createPostInBlogValidation =
    [titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleware]
export const updatePostValidation =
    [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware]