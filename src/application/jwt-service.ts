import "reflect-metadata"
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import {randomUUID} from "crypto";
import {JwtRepositoryClass} from "../repositories/jwt-repository";
import {UsersServiceClass} from "../domain/user-service";
import {inject, injectable} from "inversify";

dotenv.config()

@injectable()
export class JwtServiceClass {

    constructor(
        @inject(UsersServiceClass) protected usersService: UsersServiceClass,
        @inject(JwtRepositoryClass) protected jwtRepository: JwtRepositoryClass,
        private JWT_SECRET: string = (process.env.JWT_SECRET === undefined) ? `undefined` : process.env.JWT_SECRET,
        private JWT_ACCESS_EXPIRES: string = (process.env.JWT_ACCESS_EXPIRES === undefined) ? `undefined` : process.env.JWT_ACCESS_EXPIRES,
        private JWT_REFRESH_EXPIRES: string = (process.env.JWT_REFRESH_EXPIRES === undefined) ? `undefined` : process.env.JWT_REFRESH_EXPIRES,
    ) {}

    async createJwt(user: any, userAgent: string = 'someDevice', ip: string | string[] | undefined) {
        const tokenPair = {
            "accessToken": jwt.sign({userId: user.id}, this.JWT_SECRET, {expiresIn: this.JWT_ACCESS_EXPIRES}),
            "refreshToken": jwt.sign({
                userId: user.id,
                deviceId: randomUUID()
            }, this.JWT_SECRET, {expiresIn: this.JWT_REFRESH_EXPIRES})
        }

        const jwtPayload: any = jwt.decode(tokenPair.refreshToken)

        jwtPayload.iat = new Date(jwtPayload.iat * 1000).toISOString()
        jwtPayload.exp = new Date(jwtPayload.exp * 1000).toISOString()

        await this.jwtRepository.insertDeviceSessions(jwtPayload, userAgent, ip)

        return tokenPair
    }

    async refreshJwt(user: any, refreshToken: string) {

        const tokenDecode: any = jwt.decode(refreshToken)
        const tokenPair = {
            "accessToken": jwt.sign({userId: user.id}, this.JWT_SECRET, {expiresIn: this.JWT_ACCESS_EXPIRES}),
            "refreshToken": jwt.sign({
                userId: user.id,
                deviceId: tokenDecode!.deviceId
            }, this.JWT_SECRET, {expiresIn: this.JWT_REFRESH_EXPIRES})
        }

        const jwtPayload: any = jwt.decode(tokenPair.refreshToken)

        jwtPayload.iat = new Date(jwtPayload.iat * 1000).toISOString()
        jwtPayload.exp = new Date(jwtPayload.exp * 1000).toISOString()

        await this.jwtRepository.updateDeviceSessions(jwtPayload)

        return tokenPair

    }

    async getUserIdByToken(token: string) {
        try {

            const result: any = jwt.verify(token, this.JWT_SECRET)

            const checkUser = await this.usersService.getUserById(result.userId)
            if (!checkUser) {
                return null
            }

            return result.userId

        } catch (error) {
            return null
        }
    }

    async getAllDevisesByToken(token: string) {
        try {

            const result: any = jwt.verify(token, this.JWT_SECRET)
            let devises = await this.jwtRepository.findAllDeviceSessionByUserId(result.userId)

            if (!devises) {
                return null
            }

            return devises

        } catch (error) {
            return null
        }
    }

    async getSpecifiedDeviceByToken(token: string) {
        try {
            const result: any = jwt.verify(token, this.JWT_SECRET)
            const devise: any = await this.jwtRepository.findDeviceSessionById(result.deviceId)
            if (!devise) {
                return null
            }

            return devise

        } catch (error) {
            return null
        }
    }

    async logoutSpecifiedDevice(token: string, deviceId: string) {

        const tokenDecode: any = jwt.decode(token)
        const device: any = await this.jwtRepository.findDeviceSessionById(deviceId)

        if (!device) return null
        if (tokenDecode.userId !== device.userId) return false

        await this.jwtRepository.deleteDeviceSession(deviceId)
        return true

    }

    async logoutAllDevices(token: string) {
        const tokenDecode: any = jwt.decode(token)

        return await this.jwtRepository.deleteAllDevicesSessions(tokenDecode.userId, tokenDecode.deviceId)
    }
}
