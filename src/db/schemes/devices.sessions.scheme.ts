import mongoose, {Schema} from "mongoose";
import {IDeviceDb} from "../../dto/interface.device";

const devicesSessionsScheme = new Schema<IDeviceDb>({
    issued: String,
    expiration: String,
    userId: String,
    deviceId: String,
    userAgent: String,
    ip: String
})

export const devicesSessionsModel = mongoose.model('DevicesSessions', devicesSessionsScheme,'DevicesSessions')