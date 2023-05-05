import {NextFunction, Request, Response} from "express";
import {validationResult} from 'express-validator'



export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const err = validationResult(req)
    if(!err.isEmpty()){
        const errorsMessages = err
                .array({onlyFirstError: true})
                .map((e: any) => ({message: e.msg, field: e.path}))
        return res.status(400).send({errorsMessages})
    }
    return next()
}




