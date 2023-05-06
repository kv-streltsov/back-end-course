import {body} from "express-validator";
import {inputValidationMiddleware} from "./input-validation-middleware";
import {blogs_list, posts_list} from "../../db/db";

const titleValidation = body('title').isString().trim().notEmpty().isLength({max: 30})
const shortDescriptionValidation = body('shortDescription').isString().trim().notEmpty().isLength({max: 100})
const contentValidation = body('content').isString().trim().notEmpty().isLength({max: 1000})

const blogIdValidation = body('blogId').isString().trim().notEmpty().custom(blogId =>{

    const checkBlogId:number = blogs_list.findIndex(value => value.id === blogId)
    if(checkBlogId){throw new Error('id not found in blog')}
    return true

})


    // .custom(blogId => {
    //
    //     const findPostId: number = posts_list.findIndex(value => value.blogId === blogId)
    //     if (findPostId !== -1) {throw new Error('blogId already in use')}
    //     return true
    //
    // })

export const createPostValidation =
    [titleValidation, shortDescriptionValidation, contentValidation, blogIdValidation, inputValidationMiddleware]
export const updatePostValidation =
    [titleValidation, shortDescriptionValidation, contentValidation, inputValidationMiddleware]