import {Router} from "express";
import {refreshTokenMiddleware} from "../middleware/refresh-token-middleware";
import {container} from "../composition.root";
import {SecurityDevicesController} from "../controllers/security.devices.controller";

export const securityDevicesRouters = Router({})
const securityDevicesController = container.resolve(SecurityDevicesController)

securityDevicesRouters.get('/devices', refreshTokenMiddleware, securityDevicesController.getSecurityDevices.bind(securityDevicesController))
securityDevicesRouters.delete('/devices', refreshTokenMiddleware, securityDevicesController.deleteSecurityDevicesExceptCurrent.bind(securityDevicesController))
securityDevicesRouters.delete('/devices/:devicesId', refreshTokenMiddleware, securityDevicesController.deleteSecurityDevicesById.bind(securityDevicesController))