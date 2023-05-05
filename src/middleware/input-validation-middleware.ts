import {Request, Response, Router} from "express";
import {body, validationResult} from 'express-validator'

export const inputValidationMiddleware = (req: Request, res: Response, next: any) => {
    const err = validationResult(req)
    let error = {
        "errorsMessages": err.array()
    }
    if (!err.isEmpty()) res.status(400).send(err)
    else next()
}