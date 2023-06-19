import {Request, Response, Router} from "express";
import {HttpStatusCode} from "../dto/interface.html-code";
import {authUserValidation} from "../middleware/validation/user-auth-validations";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/user-service";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {RequestWithBody} from "../dto/interface.request";
import {
    ICodeConfirm,
    IEmail,
    INewPasswordRecoveryInput,
    InterfaceUserAuthPost,
    InterfaceUserInput
} from "../dto/interface.user";
import {createUserValidation} from "../middleware/validation/user-input-validations";
import {emailService} from "../domain/email-service";
import {refreshTokenMiddleware} from "../middleware/refresh-token-middleware";
import * as dotenv from "dotenv";
import {rateLimitMiddleware} from "../middleware/rate-limit-middleware";
import {log} from "util";
import {usersModel} from "../db/schemes/users.scheme";
import {rateLimitModel} from "../db/schemes/rate.limit.scheme";
import {recoveryPasswordValidator} from "../middleware/validation/password-recovery-validations";

dotenv.config()
export const COOKIE_SECURE: boolean = process.env.COOKIE_SECURE === null ? false : process.env.COOKIE_SECURE === 'true';

export const authRouters = Router({})

///////////////////////////////////////////////  TOKEN FLOW     ////////////////////////////////////////////////////////
authRouters.post('/login', rateLimitMiddleware, authUserValidation, async (req: RequestWithBody<InterfaceUserAuthPost>, res: Response) => {

    const userAuth = await usersService.checkUser(req.body.loginOrEmail, req.body.password)
    if (!userAuth) {
        return res.sendStatus(HttpStatusCode.UNAUTHORIZED)
    }

    if (userAuth) {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
        const jwtPair = await jwtService.createJwt(userAuth, req.headers["user-agent"], ip)

        res.cookie('refreshToken', jwtPair.refreshToken, {httpOnly: true, secure: COOKIE_SECURE})
        return res.status(HttpStatusCode.OK).send({
            "accessToken": jwtPair.accessToken
        })
    }
    return
})
authRouters.post('/logout', refreshTokenMiddleware, async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken
    const result = await jwtService.getSpecifiedDeviceByToken(refreshToken)
    await jwtService.logoutSpecifiedDevice(req.cookies.refreshToken, result!.deviceId)

    res.sendStatus(HttpStatusCode.NO_CONTENT)
})
authRouters.post('/refresh-token', refreshTokenMiddleware, async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken
    const jwtPair = await jwtService.refreshJwt(req.user, refreshToken)

    res.cookie('refreshToken', jwtPair.refreshToken, {httpOnly: true, secure: COOKIE_SECURE})
    return res.status(HttpStatusCode.OK).send({
        "accessToken": jwtPair.accessToken
    })

})

///////////////////////////////////////////  REGISTRATION FLOW     /////////////////////////////////////////////////////
authRouters.post('/registration', rateLimitMiddleware, createUserValidation, async (req: RequestWithBody<InterfaceUserInput>, res: Response) => {
    const createdUser = await usersService.postUser(req.body.login, req.body.email, req.body.password)
    await emailService.sendMailRegistration(createdUser.createdUser.email, createdUser.uuid)
    res.sendStatus(HttpStatusCode.NO_CONTENT)
})
authRouters.post('/registration-confirmation', rateLimitMiddleware, async (req: RequestWithBody<ICodeConfirm>, res: Response) => {
    const result = await usersService.confirmationUser(req.body.code)
    if (!result.isSuccess) {
        res.status(HttpStatusCode.BAD_REQUEST).send(result.errorsMessages)
        return
    }
    res.sendStatus(HttpStatusCode.NO_CONTENT)
})
authRouters.post('/registration-email-resending', rateLimitMiddleware, async (req: RequestWithBody<IEmail>, res: Response) => {
    const result = await usersService.reassignConfirmationCode(req.body.email)
    if (!result.isSuccess) {
        res.status(HttpStatusCode.BAD_REQUEST).json(result.errorsMessages)
        return
    }

    await emailService.sendMailRegistration(req.body.email, result.data!)
    res.sendStatus(HttpStatusCode.NO_CONTENT)
})
authRouters.post('/password-recovery', rateLimitMiddleware, async (req: RequestWithBody<IEmail>, res: Response) => {
    const result = await emailService.sendMailPasswordRecovery(req.body.email)
    if (result !== true) {
        res.status(HttpStatusCode.BAD_REQUEST).send(result)
        return
    }
    res.sendStatus(HttpStatusCode.NO_CONTENT)

})
authRouters.post('/new-password', rateLimitMiddleware, recoveryPasswordValidator, async (req: RequestWithBody<INewPasswordRecoveryInput>, res: Response) => {
    const result = await usersService.recoveryPassword(req.body.newPassword, req.body.recoveryCode)
    if (!result) {
        res.sendStatus(HttpStatusCode.BAD_REQUEST)
        return
    }
    res.sendStatus(HttpStatusCode.NO_CONTENT)

})
authRouters.get('/me', authMiddleware, async (req: Request, res: Response) => {
    res.status(200).json({
        "email": req.user.email,
        "login": req.user.login,
        "userId": req.user.id
    })
})