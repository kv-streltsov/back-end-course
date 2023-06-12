import {collectionRateLimit} from "../db/db_mongo";
import {NextFunction, Request, Response} from "express";



export const rateCountLimitMiddleware = async (req: Request, res: Response, next: NextFunction)=>{

	const rangeDate = Math.floor(new Date().getTime() / 1000) - 10
	await collectionRateLimit.find({date: {$gte : rangeDate}}).toArray()
	next()
}