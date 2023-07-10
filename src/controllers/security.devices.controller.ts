import "reflect-metadata"
import {Request, Response} from "express";
import {HttpStatusCode} from "../dto/interface.html-code";
import {JwtServiceClass} from "../application/jwt-service";
import {inject, injectable} from "inversify";

@injectable()
export class SecurityDevicesController {
    constructor(@inject(JwtServiceClass)protected jwtService: JwtServiceClass) {}
    async getSecurityDevices(req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken
        const result = await this.jwtService.getAllDevisesByToken(refreshToken)

        if (result === null) {
            res.sendStatus(HttpStatusCode.NOT_FOUND)
            return
        }

        res.status(HttpStatusCode.OK).send(result)
    }
    async deleteSecurityDevicesExceptCurrent(req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken
        await this.jwtService.logoutAllDevices(refreshToken)
        res.sendStatus(HttpStatusCode.NO_CONTENT)

    }
    async deleteSecurityDevicesById(req: Request, res: Response) {

        const refreshToken = req.cookies.refreshToken
        const result = await this.jwtService.logoutSpecifiedDevice(refreshToken, req.params.devicesId)

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