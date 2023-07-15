import {RequestWithBody} from "../dto/interface.request";
import {
    ICodeConfirm,
    IEmail,
    INewPasswordRecoveryInput,
    InterfaceUserAuthPost,
    InterfaceUserInput
} from "../dto/interface.user";
import {Request, Response} from "express";
import {HttpStatusCode} from "../dto/interface.html-code";
import {UsersServiceClass} from "../domain/user-service";
import {JwtServiceClass} from "../application/jwt-service";
import {EmailServiceClass} from "../domain/email-service";
import {inject, injectable} from "inversify";
import * as dotenv from "dotenv";
dotenv.config()

@injectable()
export class AuthController {
    constructor(

        @inject(UsersServiceClass)protected usersService: UsersServiceClass,
        @inject(JwtServiceClass)  protected jwtService: JwtServiceClass,
        @inject(EmailServiceClass)protected emailService: EmailServiceClass,
        private COOKIE_SECURE: boolean = process.env.COOKIE_SECURE === null ? false : process.env.COOKIE_SECURE === 'true',
    ) {
    }
    ////////////////////////////////////  TOKEN FLOW     /////////////////////////////////////////
    async login(req: RequestWithBody<InterfaceUserAuthPost>, res: Response) {
        const userAuth = await this.usersService.checkUser(req.body.loginOrEmail, req.body.password)
        if (!userAuth) {
            return res.sendStatus(HttpStatusCode.UNAUTHORIZED)
        }

        if (userAuth) {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const jwtPair = await this.jwtService.createJwt(userAuth, req.headers["user-agent"], ip)

            res.cookie('refreshToken', jwtPair.refreshToken, {httpOnly: true, secure: this.COOKIE_SECURE})
            return res.status(HttpStatusCode.OK).send({
                "accessToken": jwtPair.accessToken
            })
        }
        return
    }

    async logout(req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken
        const result = await this.jwtService.getSpecifiedDeviceByToken(refreshToken)
        await this.jwtService.logoutSpecifiedDevice(req.cookies.refreshToken, result!.deviceId)

        res.sendStatus(HttpStatusCode.NO_CONTENT)
    }

    async refreshToken(req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken
        const jwtPair = await this.jwtService.refreshJwt(req.user, refreshToken)

        res.cookie('refreshToken', jwtPair.refreshToken, {httpOnly: true, secure: this.COOKIE_SECURE})
        return res.status(HttpStatusCode.OK).send({
            "accessToken": jwtPair.accessToken
        })

    }

    /////////////////////////////////    REGISTRATION FLOW    ///////////////////////////////////

    async registration(req: RequestWithBody<InterfaceUserInput>, res: Response) {
        const createdUser = await this.usersService.postUser(req.body.login, req.body.email, req.body.password)
        await this.emailService.sendMailRegistration(createdUser.createdUser.email, createdUser.uuid)
        res.sendStatus(HttpStatusCode.NO_CONTENT)
    }

    async registrationConfirmation(req: RequestWithBody<ICodeConfirm>, res: Response) {
        const result = await this.usersService.confirmationUser(req.body.code)
        if (!result.isSuccess) {
            res.status(HttpStatusCode.BAD_REQUEST).send(result.errorsMessages)
            return
        }
        res.sendStatus(HttpStatusCode.NO_CONTENT)
    }

    async registrationEmailResending(req: RequestWithBody<IEmail>, res: Response) {
        const result = await this.usersService.reassignConfirmationCode(req.body.email)
        if (!result.isSuccess) {
            res.status(HttpStatusCode.BAD_REQUEST).json(result.errorsMessages)
            return
        }

        await this.emailService.sendMailRegistration(req.body.email, result.data!)
        res.sendStatus(HttpStatusCode.NO_CONTENT)
    }

    async passwordRecovery(req: RequestWithBody<IEmail>, res: Response) {
        const result = await this.emailService.sendMailPasswordRecovery(req.body.email)
        if (result !== true) {
            res.status(HttpStatusCode.BAD_REQUEST).send(result)
            return
        }
        res.sendStatus(HttpStatusCode.NO_CONTENT)

    }

    async newPassword(req: RequestWithBody<INewPasswordRecoveryInput>, res: Response) {
        const result = await this.usersService.recoveryPassword(req.body.newPassword, req.body.recoveryCode)
        if (!result) {
            res.sendStatus(HttpStatusCode.BAD_REQUEST)
            return
        }
        res.sendStatus(HttpStatusCode.NO_CONTENT)

    }

    async me(req: Request, res: Response) {
        res.status(200).json({
            "email": req.user.email,
            "login": req.user.login,
            "userId": req.user.id
        })
    }


}



