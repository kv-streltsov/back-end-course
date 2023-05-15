import {NextFunction, Request, Response} from "express";
import * as dotenv from 'dotenv'

dotenv.config()

const BASIC_PASS: string | undefined = process.env.BASIC_AUTH
export const basic_auth = (req: Request, res: Response, next: NextFunction) => {

    if (req.headers.authorization === undefined) {
        res.sendStatus(401)
    } else if (req.headers.authorization.split(' ')[1] === BASIC_PASS) {
        next()
    } else if (req.headers.authorization.split(' ')[1] !== BASIC_PASS) {
        res.sendStatus(401)
    }
}

