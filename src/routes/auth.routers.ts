import {Request, Response, Router} from "express";
import {HttpStatusCode} from "../dto/interface.html-code";
import {authUserValidation} from "../middleware/validation/user-auth-validations";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/user-service";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {RequestWithBody} from "../dto/interface.request";
import {ICodeConfirm, IEmail, InterfaceUserAuthPost, InterfaceUserInput} from "../dto/interface.user";
import {createUserValidation} from "../middleware/validation/user-input-validations";
import {emailService} from "../domain/email-service";
import {refreshTokenMiddleware} from "../middleware/refresh-token-middleware";
import {rateCountLimitMiddleware} from "../middleware/rate-limit-middleware";
import * as dotenv from "dotenv";

dotenv.config()
export const COOKIE_SECURE: boolean = process.env.COOKIE_SECURE === null ? false : process.env.COOKIE_SECURE === 'true';

export const authRouters = Router({})

///////////////////////////////////////////////  TOKEN FLOW     ////////////////////////////////////////////////////////
authRouters.post('/login', rateCountLimitMiddleware, authUserValidation, async (req: RequestWithBody<InterfaceUserAuthPost>, res: Response) => {

	const userAuth = await usersService.checkUser(req.body.loginOrEmail, req.body.password)
	if (!userAuth) {
		return res.sendStatus(HttpStatusCode.UNAUTHORIZED)
	}

	if (userAuth) {
		const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
		const jwtPair = await jwtService.createJwt(userAuth, req.headers["user-agent"],ip)

		res.cookie('refreshToken', jwtPair.refreshToken, {httpOnly: true, secure: COOKIE_SECURE})
		return res.status(HttpStatusCode.OK).send({
			"accessToken": jwtPair.accessToken
		})
	}
	return
})
authRouters.post('/logout', refreshTokenMiddleware, async (req: Request, res: Response) => {
	await jwtService.logout(req.cookies.refreshToken)
	res.sendStatus(HttpStatusCode.NO_CONTENT)
})
authRouters.post('/refresh-token', refreshTokenMiddleware, async (req: Request, res: Response) => {

	const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
	const jwtPair = await jwtService.createJwt(req.user,req.headers["user-agent"],ip)
	res.cookie('refreshToken', jwtPair.refreshToken, {httpOnly: true, secure: COOKIE_SECURE})
	return res.status(HttpStatusCode.OK).send({
		"accessToken": jwtPair.accessToken
	})

})

///////////////////////////////////////////  REGISTRATION FLOW     /////////////////////////////////////////////////////
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
authRouters.get('/me', authMiddleware, async (req: Request, res: Response) => {

	res.status(200).json({
		"email": req.user.email,
		"login": req.user.login,
		"userId": req.user.id
	})
})