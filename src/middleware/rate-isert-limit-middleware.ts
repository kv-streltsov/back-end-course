import {collectionRateLimit} from "../db/db_mongo";
import {NextFunction, Request, Response} from "express";


export const rateInsertLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	await collectionRateLimit.insertOne({
		ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
		baseUrl: req.originalUrl,
		date: Math.floor(new Date().getTime() / 1000)
	})
	next()
}