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
import * as dotenv from "dotenv";
import {collectionUsers} from "../db/db_mongo";

dotenv.config()
export const COOKIE_SECURE: boolean = process.env.COOKIE_SECURE === null ? false : process.env.COOKIE_SECURE === 'true';

export const authRouters = Router({})

authRouters.post('/login', authUserValidation, async (req: RequestWithBody<InterfaceUserAuthPost>, res: Response) => {
	const userAuth = await usersService.checkUser(req.body.loginOrEmail, req.body.password)
	if (userAuth === null || userAuth === false) {
		res.sendStatus(HttpStatusCode.UNAUTHORIZED)
	}

	if (userAuth) {
		const jwtPair = await jwtService.createJwt(userAuth)
		res.cookie('refreshToken', jwtPair.refreshToken, {httpOnly: true, secure: COOKIE_SECURE})
		res.status(HttpStatusCode.OK).send({
			"accessToken": jwtPair.accessToken
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
	const refreshToken: string = req.cookies.refreshToken
	const jwtPair = await jwtService.refreshJwtPair(refreshToken)
	if (!jwtPair) {
		res.sendStatus(HttpStatusCode.UNAUTHORIZED)
		return
	}
	console.log(refreshToken)
	console.log({"refreshToken": jwtPair.refreshToken})
	res.cookie('refreshToken', jwtPair.refreshToken, {httpOnly: true, secure: COOKIE_SECURE})
	res.status(HttpStatusCode.OK).send({
		"accessToken": jwtPair.accessToken
	})

})
authRouters.post('/logout', async (req: Request, res: Response) => {
	const refreshToken: string = req.cookies.refreshToken
	const result = await jwtService.revokeRefreshToken(refreshToken)
	if (!result) {
		res.sendStatus(HttpStatusCode.UNAUTHORIZED)
		return
	}
	res.sendStatus(HttpStatusCode.NO_CONTENT)


})
authRouters.get('/me', async (req: Request, res: Response) => {
	const userId = await jwtService.getUserIdByToken(req.body.accessToken)
	const user = await collectionUsers.findOne({id: userId})
	if (!user) {
		res.sendStatus(HttpStatusCode.UNAUTHORIZED)
		return
	}
	res.status(200).json({
		"email": user.email,
		"login": user.login,
		"userId": user.id
	})
})