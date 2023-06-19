import {NextFunction, Request, Response} from "express";
import {HttpStatusCode} from "../dto/interface.html-code";
import {rateLimitModel} from "../db/schemes/rate.limit.scheme";


export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    debugger
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    const baseUrl = req.originalUrl
    await rateLimitModel.create({
        ip,
        baseUrl,
        date: Math.floor(new Date().getTime() / 1000)
    })

    const rangeDate = Math.floor(new Date().getTime() / 1000) - 10
    const requestCount = await rateLimitModel.countDocuments({ip: ip, baseUrl: baseUrl, date: {$gte: rangeDate}})
    if (requestCount > 5) {
		res.sendStatus(HttpStatusCode.TOO_MANY_REQUESTS)
        return
    }
    next()
}