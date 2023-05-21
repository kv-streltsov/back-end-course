import {Request, Response, Router} from "express";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {createUserValidation} from "../middleware/validation/user-input-validations";
import bcrypt from 'bcrypt'




export const authRouters = Router({})



authRouters.post('/login', basic_auth, createUserValidation, async (req: Request, res: Response) => {

})



