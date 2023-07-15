import {NextFunction, Request, Response} from "express";
import * as dotenv from 'dotenv'
import {HttpStatusCode} from "../dto/interface.html-code";
import {jwtService, usersService} from "../composition.root";

dotenv.config()


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(HttpStatusCode.UNAUTHORIZED)
        return
    }

    const token = req.headers.authorization.split(' ')[1]
    const userId = await jwtService.getUserIdByToken(token)
    if (userId) {
        req.user = await usersService.getUserById(userId)
        next()
    } else {
        res.sendStatus(HttpStatusCode.UNAUTHORIZED)
        return
    }

}