import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {collectionExpiredTokens, collectionUsers} from "../db/db_mongo";


export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {

	const refreshToken = req.cookies.refreshToken
	if (!refreshToken) return res.sendStatus(401)

	const userId = await jwtService.getUserIdByToken(refreshToken)
	if (!userId) return res.sendStatus(401)

	const user = await collectionUsers.findOne({id: userId})
	if (!user) return res.sendStatus(401)

	const isBlocked = await collectionExpiredTokens.findOne({expiredToken: refreshToken})
	if (isBlocked) return res.sendStatus(401)

	await collectionExpiredTokens.insertOne({expiredToken: refreshToken})

	req.user = user

	return next()

}