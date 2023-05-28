import {Request, Response, Router} from "express";
import {HttpStatusCode} from "../dto/interface.html-code";
import {authUserValidation} from "../middleware/validation/user-auth-validations";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/user-service";


export const authRouters = Router({})


authRouters.post('/login', authUserValidation, async (req: Request, res: Response) => {

    const userAuth = await usersService.checkUser(req.body.loginOrEmail, req.body.password)

    if (userAuth === null || userAuth === false) {
        res.sendStatus(HttpStatusCode.UNAUTHORIZED)
    }

    if (userAuth) {
        const token = {
            "accessToken": await jwtService.createJwt(userAuth)
        }
        res.status(HttpStatusCode.OK).send(token)
    }


})



