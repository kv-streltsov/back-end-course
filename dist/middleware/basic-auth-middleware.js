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
Object.defineProperty(exports, "__esModule", { value: true });
exports.basic_auth = void 0;
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const BASIC_PASS = process.env.BASIC_AUTH;
const basic_auth = (req, res, next) => {
    console.log(req.headers.authorization);
    if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] != "Basic") {
        res.sendStatus(401);
    }
    else if (req.headers.authorization.split(' ')[1] === BASIC_PASS) {
        next();
    }
    else if (req.headers.authorization.split(' ')[1] !== BASIC_PASS) {
        res.sendStatus(401);
    }
};
exports.basic_auth = basic_auth;
//# sourceMappingURL=basic-auth-middleware.js.map