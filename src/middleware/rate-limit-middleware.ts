import {collectionRateLimit} from "../db/db_mongo";
import {NextFunction, Request, Response} from "express";
import {log} from "util";
import {HttpStatusCode} from "../dto/interface.html-code";


export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const baseUrl = req.originalUrl
    await collectionRateLimit.insertOne({
        ip,
        baseUrl,
        date: Math.floor(new Date().getTime() / 1000)
    })

    const rangeDate = Math.floor(new Date().getTime() / 1000) - 10
    const requestCount = await collectionRateLimit.countDocuments({ip: ip, baseUrl: baseUrl, date: {$gte: rangeDate}})
    if (requestCount > 5) {
		res.sendStatus(HttpStatusCode.TOO_MANY_REQUESTS)
        return
    }
    next()
}