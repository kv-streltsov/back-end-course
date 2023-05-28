import {Request, Response, Router} from "express";
import {HttpStatusCode} from "../dto/interface.html-code";
import {authUserValidation} from "../middleware/validation/user-auth-validations";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/user-service";
import {authMiddleware} from "../middleware/jwt-auth-middleware";


export const authRouters = Router({})


authRouters.post('/login', authUserValidation, async (req: Request, res: Response) => {

    const userAuth = await usersService.checkUser(req.body.loginOrEmail, req.body.password)

    if (userAuth === null || userAuth === false) {
        res.sendStatus(HttpStatusCode.UNAUTHORIZED)
    }

    if (userAuth) {
        const token =  await jwtService.createJwt(userAuth)
        res.status(HttpStatusCode.OK).send(token)
    }


})
authRouters.get('/me', authMiddleware, async (req: Request, res: Response) => {
    const user = {
        "email": req.user.email,
        "login": req.user.login,
        "userId": req.user.id
    }
    res.status(200).send(user)

})



