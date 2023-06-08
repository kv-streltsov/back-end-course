import {Request, Response, Router} from "express";
import {HttpStatusCode} from "../dto/interface.html-code";
import {authUserValidation} from "../middleware/validation/user-auth-validations";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/user-service";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {RequestWithBody} from "../dto/interface.request";
import {ICodeConfirm, IEmail, InterfaceUserAuthPost, InterfaceUserInput, IUuid} from "../dto/interface.user";
import {createUserValidation} from "../middleware/validation/user-input-validations";
import {emailService} from "../domain/email-service";


export const authRouters = Router({})

authRouters.post('/login', authUserValidation, async (req: RequestWithBody<InterfaceUserAuthPost>, res: Response) => {
	const userAuth = await usersService.checkUser(req.body.loginOrEmail, req.body.password)
	if (userAuth === null || userAuth === false) {
		res.sendStatus(HttpStatusCode.UNAUTHORIZED)
	}

	if (userAuth) {
		const token = await jwtService.createJwt(userAuth)
		res.cookie('refresh_token', token.refreshToken, {httpOnly: true, secure: true})

		res.status(HttpStatusCode.OK).send({
			"accessToken": token.accessToken
		})
	}


})
authRouters.post('/registration', createUserValidation, async (req: RequestWithBody<InterfaceUserInput>, res: Response) => {
	const createdUser = await usersService.postUser(req.body.login, req.body.email, req.body.password)
	await emailService.sendMailRegistration(createdUser.createdUser.email, createdUser.uuid)
	res.sendStatus(HttpStatusCode.NO_CONTENT)
})
authRouters.post('/registration-confirmation', async (req: RequestWithBody<ICodeConfirm>, res: Response) => {
	const result = await usersService.confirmationUser(req.body.code)
	if (!result.isSuccess) {
		res.status(HttpStatusCode.BAD_REQUEST).send(result.errorsMessages)
		return
	}
	res.sendStatus(HttpStatusCode.NO_CONTENT)
})
authRouters.post('/registration-email-resending', async (req: RequestWithBody<IEmail>, res: Response) => {
	const result = await usersService.reassignConfirmationCode(req.body.email)
	if (!result.isSuccess) {
		res.status(HttpStatusCode.BAD_REQUEST).json(result.errorsMessages)
		return
	}

	await emailService.sendMailRegistration(req.body.email, result.data!)
	res.sendStatus(HttpStatusCode.NO_CONTENT)
})
authRouters.post('/refresh-token', async (req: Request, res: Response) => {
	const refreshToken: string = req.cookies.refresh_token
	const jwtPair = await jwtService.refreshJwtPair(refreshToken)
	if(!jwtPair){
		res.sendStatus(HttpStatusCode.UNAUTHORIZED)
		return
	}
	res.cookie('refresh_token', jwtPair.refreshToken, {httpOnly: true, secure: true})
	res.status(HttpStatusCode.OK).send({
		"accessToken": jwtPair.accessToken
	})

})
authRouters.get('/me', authMiddleware, async (req: Request, res: Response) => {
	const user = {
		"email": req.user.email,
		"login": req.user.login,
		"userId": req.user.id
	}
	res.status(200).send(user)
})