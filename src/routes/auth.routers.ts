import {Request, Response, Router} from "express";
import {HttpStatusCode} from "../dto/interface.html-code";
import {authUserValidation} from "../middleware/validation/user-auth-validations";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/user-service";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {RequestWithBody, RequestWithQuery} from "../dto/interface.request";
import {ICodeConfirm, IEmail, InterfaceUserInput} from "../dto/interface.user";
import {createUserValidation} from "../middleware/validation/user-input-validations";
import {emailService} from "../domain/email-service";
import {collectionUsers} from "../db/db_mongo";
import {registrationConfirmationValidation} from "../middleware/validation/user-confirmation-validations";
import {emailResendingValidation} from "../middleware/validation/email-resending-validations";


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
authRouters.post('/registration', createUserValidation, async (req: RequestWithBody<InterfaceUserInput>, res: Response) => {
    const createdUser = await usersService.postUser(req.body.login, req.body.email, req.body.password)
    await emailService.sendMailRegistration(createdUser.createdUser.email, createdUser.uuid)
    res.sendStatus(HttpStatusCode.NO_CONTENT)
})
authRouters.post('/registration-confirmation',  async (req: RequestWithBody<ICodeConfirm>, res: Response) => {
    const result = await usersService.confirmationUser(req.body.code)
    if (result === null) {
        res.sendStatus(HttpStatusCode.BAD_REQUEST)
        return
    }
    res.sendStatus(HttpStatusCode.NO_CONTENT)
})
authRouters.post('/registration-email-resending', async (req: RequestWithBody<IEmail>, res: Response) => {
    const result = await usersService.reassignConfirmationCode(req.body.email)
    const findUser = await collectionUsers.findOne({email: req.body.email},)
    if (result === null || findUser === null) {
        res.sendStatus(HttpStatusCode.BAD_REQUEST)
        return
    }
    await emailService.sendMailRegistration(req.body.email, findUser.confirmation.code)
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