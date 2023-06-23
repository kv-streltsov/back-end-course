import {Request, Response, Router} from "express";
import {refreshTokenMiddleware} from "../middleware/refresh-token-middleware";
import {jwtService} from "../application/jwt-service";
import {HttpStatusCode} from "../dto/interface.html-code";


export const securityDevicesRouters = Router({})


class SecurityDevicesController {
    async getSecurityDevices(req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken
        const result = await jwtService.getAllDevisesByToken(refreshToken)

        if (result === null) {
            res.sendStatus(HttpStatusCode.NOT_FOUND)
            return
        }

        res.status(HttpStatusCode.OK).send(result)
    }
    async deleteSecurityDevicesExceptCurrent(req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken
        await jwtService.logoutAllDevices(refreshToken)
        res.sendStatus(HttpStatusCode.NO_CONTENT)

    }
    async deleteSecurityDevicesById(req: Request, res: Response) {

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
    }
}



const securityDevicesController = new SecurityDevicesController()
securityDevicesRouters.get('/devices', refreshTokenMiddleware, securityDevicesController.getSecurityDevices)
securityDevicesRouters.delete('/devices', refreshTokenMiddleware, securityDevicesController.deleteSecurityDevicesExceptCurrent)
securityDevicesRouters.delete('/devices/:devicesId', refreshTokenMiddleware, securityDevicesController.deleteSecurityDevicesById)