import {collectionDevicesSessions, } from "../db/db_mongo";
import {IDevice, IDeviceView} from "../dto/interface.device";


export const jwtRepository = {
    findDeviceSessionById: async (deviceId: string) => {
        try {
            return await collectionDevicesSessions.findOne({deviceId: deviceId})
        } catch (error) {
            return error
        }
    },
    findAllDeviceSessionByUserId: async (userId: string) => {
        try {
            const allDevises = await collectionDevicesSessions
                .find(
                    {userId: userId},
                    {projection: {_id: 0, expiration: 0,}}).toArray()

            const deviceView: IDeviceView[] = allDevises.map(devise => {
                return {
                    ip: devise.ip,
                    title: devise.userAgent,
                    lastActiveDate: devise.issued,
                    deviceId: devise.deviceId
                }
            })
            return deviceView
        } catch (error) {
            return error
        }
    },
    insertDeviceSessions: async (deviceSession: IDevice, userAgent: string, ip: string | string[] | undefined) => {
        try {

            const result = await collectionDevicesSessions.find({
                ip: ip,
                userAgent: userAgent,
                userId: deviceSession.userId
            }).toArray()

            if (result.length) {
                await collectionDevicesSessions.updateOne({userId: deviceSession.userId}, {
                    $set: {
                        issued: deviceSession.iat,
                        expiration: deviceSession.exp,
                        deviceId: deviceSession.deviceId,
                    }
                })
                return true
            }

            await collectionDevicesSessions.insertOne({
                issued: deviceSession.iat,
                expiration: deviceSession.exp,
                userId: deviceSession.userId,
                deviceId: deviceSession.deviceId,
                userAgent,
                ip,

            })
            return true

        } catch (error) {
            return false
        }
    },
    updateDeviceSessions: async (deviceSession: IDevice) => {
        try {
            await collectionDevicesSessions.updateOne({
                userId: deviceSession.userId,
                deviceId: deviceSession.deviceId
            }, {
                $set: {
                    issued: deviceSession.iat,
                    expiration: deviceSession.exp
                }
            })

            return true

        } catch (error) {
            return false
        }
    },
    deleteDeviceSession: async (deviceId: string) => {
        try {
            await collectionDevicesSessions.deleteOne({deviceId: deviceId})
            return true
        } catch (error) {
            return error
        }
    },
    deleteAllDevicesSessions: async (userId: string, deviceId: string) => {
        try {
            await collectionDevicesSessions.deleteMany(
                {deviceId: {$ne: deviceId}, userId: userId}
            )
            return true
        } catch (error) {
            return error
        }
    }

}