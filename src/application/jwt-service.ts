import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import {collectionDevicesSessions, collectionUsers} from "../db/db_mongo";
import {randomUUID} from "crypto";
import {jwtRepository} from "../repositories/jwt-repository";
import {format, compareAsc} from 'date-fns'
import {IDevice, IDeviceDB} from "../dto/interface.device";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES

if (!JWT_SECRET || !JWT_REFRESH_EXPIRES || !JWT_ACCESS_EXPIRES) {
    throw new Error('not found something jwt env')
}

export const jwtService = {
    async createJwt(user: any, userAgent: string = 'someDevice', ip: string | string[] | undefined) {

        const tokenPair = {
            "accessToken": jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: JWT_ACCESS_EXPIRES}),
            "refreshToken": jwt.sign({
                userId: user.id,
                deviceId: randomUUID()
            }, JWT_SECRET, {expiresIn: JWT_REFRESH_EXPIRES})
        }

        const jwtPayload: any = jwt.decode(tokenPair.refreshToken)

        jwtPayload.iat = new Date(jwtPayload.iat * 1000).toISOString()
        jwtPayload.exp = new Date(jwtPayload.exp * 1000).toISOString()

        await jwtRepository.insertDeviceSessions(jwtPayload, userAgent, ip)

        return tokenPair
    },
    async refreshJwt(user: any, refreshToken: string, userAgent: string = 'someDevice', ip: string | string[] | undefined) {

        const tokenDecode: any = jwt.decode(refreshToken)
        const tokenPair = {
            "accessToken": jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: JWT_ACCESS_EXPIRES}),
            "refreshToken": jwt.sign({
                userId: user.id,
                deviceId: tokenDecode!.deviceId
            }, JWT_SECRET, {expiresIn: JWT_REFRESH_EXPIRES})
        }

        const jwtPayload: any = jwt.decode(tokenPair.refreshToken)

        jwtPayload.iat = new Date(jwtPayload.iat * 1000).toISOString()
        jwtPayload.exp = new Date(jwtPayload.exp * 1000).toISOString()

        await jwtRepository.updateDeviceSessions(jwtPayload, userAgent, ip)

        return tokenPair

    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET)
            const checkUser = await collectionUsers.findOne({id: result.userId})
            if (!checkUser) {
                return null
            }

            return result.userId

        } catch (error) {
            return null
        }
    },
    async getAllDevisesByToken(token: string) {
        try {

            const result: any = jwt.verify(token, JWT_SECRET)
            let devises = await jwtRepository.findAllDeviceSessionByUserId(result.userId)

            if (!devises) {
                return null
            }

            return devises

        } catch (error) {
            return null
        }
    },
    async getSpecifiedDeviceByToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET)
            const devise = await collectionDevicesSessions.findOne({deviceId: result.deviceId})
            if (!devise) {
                return null
            }

            return devise

        } catch (error) {
            return null
        }
    },
    async logoutSpecifiedDevice(token: string, deviceId: string) {

        const tokenDecode: any = jwt.decode(token)
        const device: any = await jwtRepository.findDeviceSessionById(deviceId)

        if (!device) return null
        if (tokenDecode.userId !== device.userId) return false

        await jwtRepository.deleteDeviceSession(deviceId)
        return true

    },
    async logoutAllDevices(token: string) {
        const tokenDecode: any = jwt.decode(token)

        return await jwtRepository.deleteAllDevicesSessions(tokenDecode.userId, tokenDecode.deviceId)
    }
}