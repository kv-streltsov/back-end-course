"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const crypto_1 = require("crypto");
const jwt_repository_1 = require("../repositories/jwt-repository");
const user_service_1 = require("../domain/user-service");
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES;
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES;
if (!JWT_SECRET || !JWT_REFRESH_EXPIRES || !JWT_ACCESS_EXPIRES) {
    throw new Error('not found something jwt env');
}
// class JwtServiceClass {
//     async createJwt(user: any, userAgent: string = 'someDevice', ip: string | string[] | undefined) {
//
//         const tokenPair = {
//             "accessToken": jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: JWT_ACCESS_EXPIRES}),
//             "refreshToken": jwt.sign({
//                 userId: user.id,
//                 deviceId: randomUUID()
//             }, JWT_SECRET, {expiresIn: JWT_REFRESH_EXPIRES})
//         }
//
//         const jwtPayload: any = jwt.decode(tokenPair.refreshToken)
//
//         jwtPayload.iat = new Date(jwtPayload.iat * 1000).toISOString()
//         jwtPayload.exp = new Date(jwtPayload.exp * 1000).toISOString()
//
//         await jwtRepository.insertDeviceSessions(jwtPayload, userAgent, ip)
//
//         return tokenPair
//     }
//     async refreshJwt(user: any, refreshToken: string) {
//
//         const tokenDecode: any = jwt.decode(refreshToken)
//         const tokenPair = {
//             "accessToken": jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: JWT_ACCESS_EXPIRES}),
//             "refreshToken": jwt.sign({
//                 userId: user.id,
//                 deviceId: tokenDecode!.deviceId
//             }, JWT_SECRET, {expiresIn: JWT_REFRESH_EXPIRES})
//         }
//
//         const jwtPayload: any = jwt.decode(tokenPair.refreshToken)
//
//         jwtPayload.iat = new Date(jwtPayload.iat * 1000).toISOString()
//         jwtPayload.exp = new Date(jwtPayload.exp * 1000).toISOString()
//
//         await jwtRepository.updateDeviceSessions(jwtPayload)
//
//         return tokenPair
//
//     }
//     async getUserIdByToken(token: string) {
//         try {
//
//             const result: any = jwt.verify(token, JWT_SECRET)
//
//             const checkUser = await usersService.getUserById(result.userId)
//             if (!checkUser) {
//                 return null
//             }
//
//             return result.userId
//
//         } catch (error) {
//             return null
//         }
//     }
//     async getAllDevisesByToken(token: string) {
//         try {
//
//             const result: any = jwt.verify(token, JWT_SECRET)
//             let devises = await jwtRepository.findAllDeviceSessionByUserId(result.userId)
//
//             if (!devises) {
//                 return null
//             }
//
//             return devises
//
//         } catch (error) {
//             return null
//         }
//     }
//     async getSpecifiedDeviceByToken(token: string) {
//         try {
//             const result: any = jwt.verify(token, JWT_SECRET)
//             const devise:any = await jwtRepository.findDeviceSessionById(result.deviceId)
//             if (!devise) {
//                 return null
//             }
//
//             return devise
//
//         } catch (error) {
//             return null
//         }
//     }
//     async logoutSpecifiedDevice(token: string, deviceId: string) {
//
//         const tokenDecode: any = jwt.decode(token)
//         const device: any = await jwtRepository.findDeviceSessionById(deviceId)
//
//         if (!device) return null
//         if (tokenDecode.userId !== device.userId) return false
//
//         await jwtRepository.deleteDeviceSession(deviceId)
//         return true
//
//     }
//     async logoutAllDevices(token: string) {
//         const tokenDecode: any = jwt.decode(token)
//
//         return await jwtRepository.deleteAllDevicesSessions(tokenDecode.userId, tokenDecode.deviceId)
//     }
// }
exports.jwtService = {
    createJwt(user, userAgent = 'someDevice', ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenPair = {
                "accessToken": jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES }),
                "refreshToken": jsonwebtoken_1.default.sign({
                    userId: user.id,
                    deviceId: (0, crypto_1.randomUUID)()
                }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES })
            };
            const jwtPayload = jsonwebtoken_1.default.decode(tokenPair.refreshToken);
            jwtPayload.iat = new Date(jwtPayload.iat * 1000).toISOString();
            jwtPayload.exp = new Date(jwtPayload.exp * 1000).toISOString();
            yield jwt_repository_1.jwtRepository.insertDeviceSessions(jwtPayload, userAgent, ip);
            return tokenPair;
        });
    },
    refreshJwt(user, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenDecode = jsonwebtoken_1.default.decode(refreshToken);
            const tokenPair = {
                "accessToken": jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_ACCESS_EXPIRES }),
                "refreshToken": jsonwebtoken_1.default.sign({
                    userId: user.id,
                    deviceId: tokenDecode.deviceId
                }, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRES })
            };
            const jwtPayload = jsonwebtoken_1.default.decode(tokenPair.refreshToken);
            jwtPayload.iat = new Date(jwtPayload.iat * 1000).toISOString();
            jwtPayload.exp = new Date(jwtPayload.exp * 1000).toISOString();
            yield jwt_repository_1.jwtRepository.updateDeviceSessions(jwtPayload);
            return tokenPair;
        });
    },
    getUserIdByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                const checkUser = yield user_service_1.usersService.getUserById(result.userId);
                if (!checkUser) {
                    return null;
                }
                return result.userId;
            }
            catch (error) {
                return null;
            }
        });
    },
    getAllDevisesByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                let devises = yield jwt_repository_1.jwtRepository.findAllDeviceSessionByUserId(result.userId);
                if (!devises) {
                    return null;
                }
                return devises;
            }
            catch (error) {
                return null;
            }
        });
    },
    getSpecifiedDeviceByToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = jsonwebtoken_1.default.verify(token, JWT_SECRET);
                const devise = yield jwt_repository_1.jwtRepository.findDeviceSessionById(result.deviceId);
                if (!devise) {
                    return null;
                }
                return devise;
            }
            catch (error) {
                return null;
            }
        });
    },
    logoutSpecifiedDevice(token, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenDecode = jsonwebtoken_1.default.decode(token);
            const device = yield jwt_repository_1.jwtRepository.findDeviceSessionById(deviceId);
            if (!device)
                return null;
            if (tokenDecode.userId !== device.userId)
                return false;
            yield jwt_repository_1.jwtRepository.deleteDeviceSession(deviceId);
            return true;
        });
    },
    logoutAllDevices(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const tokenDecode = jsonwebtoken_1.default.decode(token);
            return yield jwt_repository_1.jwtRepository.deleteAllDevicesSessions(tokenDecode.userId, tokenDecode.deviceId);
        });
    }
};
//# sourceMappingURL=jwt-service.js.map