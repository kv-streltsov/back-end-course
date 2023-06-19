import {Request, Response, Router} from "express";
import {refreshTokenMiddleware} from "../middleware/refresh-token-middleware";
import {jwtService} from "../application/jwt-service";
import {HttpStatusCode} from "../dto/interface.html-code";


export const securityDevicesRouters = Router({})

securityDevicesRouters.get('/devices', refreshTokenMiddleware, async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken
    const result = await jwtService.getAllDevisesByToken(refreshToken)

    if (result === null) {
        res.sendStatus(HttpStatusCode.NOT_FOUND)
        return }

    res.status(HttpStatusCode.OK).send(result)
})
securityDevicesRouters.delete('/devices', refreshTokenMiddleware, async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken
    await jwtService.logoutAllDevices(refreshToken)
    res.sendStatus(HttpStatusCode.NO_CONTENT)

})
securityDevicesRouters.delete('/devices/:devicesId', refreshTokenMiddleware, async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken
    const result = await jwtService.logoutSpecifiedDevice(refreshToken, req.params.devicesId)

    if (result === null) {
        res.sendStatus(HttpStatusCode.NOT_FOUND)
        return
    }
    if (!result) {
        res.sendStatus(HttpStatusCode.FORBIDDEN)
        return
    }
    res.sendStatus(HttpStatusCode.NO_CONTENT)
})