import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import {collectionDevicesSessions, collectionUsers} from "../db/db_mongo";
import {randomUUID} from "crypto";
import {jwtRepository} from "../repositories/jwt-repository";
import {IDevice} from "../dto/interface.device";

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
        await jwtRepository.insertDeviceSessions(jwtPayload, userAgent, ip)

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
            const devises = await collectionDevicesSessions.find({userId: result.userId}).toArray()
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
    async logoutSpecifiedDevice(token: string, deviceId: string = 'false') {

        const tokenDecode: any = jwt.decode(token)
        if (deviceId === 'false') return await jwtRepository.deleteDeviceSession(tokenDecode.deviceId)
        if (tokenDecode.deviceId === deviceId) {
			return jwtRepository.deleteDeviceSession(deviceId)
        }
        if(tokenDecode.deviceId !== deviceId) return false


    },
    async logoutAllDevices(token: string) {
        const tokenDecode: any = jwt.decode(token)
        return await jwtRepository.deleteAllDevicesSessions(tokenDecode.userId)
    }
}