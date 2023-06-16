import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import { collectionUsers} from "../db/db_mongo";
import {HttpStatusCode} from "../dto/interface.html-code";


export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const refreshToken = req.cookies.refreshToken
	if (!refreshToken) return res.sendStatus(HttpStatusCode.UNAUTHORIZED)

	const userId = await jwtService.getUserIdByToken(refreshToken)
	if (!userId) return res.sendStatus(HttpStatusCode.UNAUTHORIZED)

	const user = await collectionUsers.findOne({id: userId})
	if (!user) return res.sendStatus(HttpStatusCode.UNAUTHORIZED)

	const device = await jwtService.getSpecifiedDeviceByToken(refreshToken)
	if(!device) return res.sendStatus(HttpStatusCode.UNAUTHORIZED)

	req.user = user

	return next()

}