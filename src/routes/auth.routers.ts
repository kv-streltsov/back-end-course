import {Request, Response, Router} from "express";
import {HttpStatusCode} from "../dto/interface.html-code";
import {authUserValidation} from "../middleware/validation/user-auth-validations";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/user-service";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {RequestWithBody, RequestWithQuery} from "../dto/interface.request";
import {ICodeConfirm, InterfaceUserInput} from "../dto/interface.user";
import {createUserValidation} from "../middleware/validation/user-input-validations";
import {emailService} from "../domain/email-service";




export const authRouters = Router({})


authRouters.post('/login', authUserValidation, async (req: Request, res: Response) => {

    const userAuth = await usersService.checkUser(req.body.loginOrEmail, req.body.password)

    if (userAuth === null || userAuth === false) {
        res.sendStatus(HttpStatusCode.UNAUTHORIZED)
    }

    if (userAuth) {
        const token = await jwtService.createJwt(userAuth)
        res.status(HttpStatusCode.OK).send(token)
    }


})

authRouters.post('/registration', createUserValidation,  async (req: RequestWithBody<InterfaceUserInput>, res: Response) => {
    const createdUser = await usersService.postUser(req.body.login,req.body.email,req.body.password)
    await emailService.sendMailRegistration(req.body.email,createdUser.uuid)
    res.sendStatus(HttpStatusCode.NO_CONTENT)
})

authRouters.post('/registration-confirmation', async (req: RequestWithQuery<ICodeConfirm>, res: Response) => {
    const result = await usersService.confirmationUser(req.query.code)
    if (result===null) {
        res.sendStatus(HttpStatusCode.BAD_REQUEST)
        return
    }
    res.sendStatus(HttpStatusCode.NO_CONTENT)
})


authRouters.get('/me', authMiddleware, async (req: Request, res: Response) => {
    const user = {
        "email": req.user.email,
        "login": req.user.login,
        "userId": req.user.id
    }
    res.status(200).send(user)
})