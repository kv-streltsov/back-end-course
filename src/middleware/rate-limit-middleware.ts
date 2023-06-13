import {collectionRateLimit} from "../db/db_mongo";
import {NextFunction, Request, Response} from "express";


export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	await collectionRateLimit.insertOne({
		ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
		baseUrl: req.originalUrl,
		date: Math.floor(new Date().getTime() / 1000)
	})

	const rangeDate = Math.floor(new Date().getTime() / 1000) - 10
	await collectionRateLimit.find({date: {$gte : rangeDate}}).toArray()
	next()
}