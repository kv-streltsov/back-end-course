import {IDevice, IDeviceView} from "../dto/interface.device";
import {devicesSessionsModel} from "../db/schemes/devices.sessions.scheme";


export const jwtRepository = {
    findDeviceSessionById: async (deviceId: string) => {
        try {
            return await devicesSessionsModel.findOne({deviceId: deviceId})
        } catch (error) {
            return error
        }
    },
    findAllDeviceSessionByUserId: async (userId: string) => {
        try {
            const allDevises = await devicesSessionsModel
                .find(
                    {userId: userId},
                    {projection: {_id: 0, expiration: 0,}}).lean()

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

            const result = await devicesSessionsModel.find({
                ip: ip,
                userAgent: userAgent,
                userId: deviceSession.userId
            }).lean()
            if (result.length) {
                await devicesSessionsModel.updateOne({userId: deviceSession.userId}, {
                    $set: {
                        issued: deviceSession.iat,
                        expiration: deviceSession.exp,
                        deviceId: deviceSession.deviceId,
                    }
                })
                return true
            }

            await devicesSessionsModel.create({
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
            await devicesSessionsModel.updateOne({
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
            await devicesSessionsModel.deleteOne({deviceId: deviceId})
            return true
        } catch (error) {
            return error
        }
    },
    deleteAllDevicesSessions: async (userId: string, deviceId: string) => {
        try {
            await devicesSessionsModel.deleteMany(
                {deviceId: {$ne: deviceId}, userId: userId}
            )
            return true
        } catch (error) {
            return error
        }
    }
}