import {NextFunction, Request, Response} from "express";
import * as dotenv from 'dotenv'
import {jwtService} from "../composition.root";

dotenv.config()

export const auth = async (req: Request, res: Response, next: NextFunction) => {

    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1]
        req.user = await jwtService.getUserIdByToken(token)

    }
    next()
}