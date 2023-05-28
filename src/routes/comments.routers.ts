import {Request, Response, Router} from "express";
import {authMiddleware} from "../middleware/jwt-auth-middleware";


export const blogComments = Router({})


blogComments.get('/', authMiddleware, async (req: Request, res: Response) => {

})