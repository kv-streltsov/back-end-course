import {Request, Response, Router} from "express";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {authService} from "../domain/auth-service";
import {HttpStatusCode} from "../dto/interface.html-code";
import {authUserValidation} from "../middleware/validation/user-auth-validations";


export const authRouters = Router({})


authRouters.post('/login', authUserValidation, async (req: Request, res: Response) => {
    const userAuth: boolean | null = await authService.checkUser(req.body.loginOrEmail, req.body.password)

    if (userAuth === true) {
        res.sendStatus(HttpStatusCode.NO_CONTENT)
    }
    if (userAuth === null) {
        res.sendStatus(HttpStatusCode.NOT_FOUND)
    }
    if (userAuth === false) {
        res.sendStatus(HttpStatusCode.UNAUTHORIZED)
    }

})



