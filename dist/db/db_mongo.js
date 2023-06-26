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
exports.clear_db_mongo = exports.runMongo = exports.MONGOOSE_URL = exports.MONGO_URL = void 0;
const dotenv = __importStar(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const devices_sessions_scheme_1 = require("./schemes/devices.sessions.scheme");
const rate_limit_scheme_1 = require("./schemes/rate.limit.scheme");
const comments_scheme_1 = require("./schemes/comments.scheme");
const users_scheme_1 = require("./schemes/users.scheme");
const posts_scheme_1 = require("./schemes/posts.scheme");
const blogs_scheme_1 = require("./schemes/blogs.scheme");
const likes_scheme_1 = require("./schemes/likes.scheme");
dotenv.config();
exports.MONGO_URL = process.env.MONGO_URL;
exports.MONGOOSE_URL = process.env.MONGOOSE_URL;
if (!exports.MONGO_URL) {
    throw new Error('!!! Bad URL');
}
function runMongo() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!exports.MONGOOSE_URL) {
            throw new Error('!!! Bad URL');
        }
        try {
            yield mongoose_1.default.connect(exports.MONGOOSE_URL);
            console.log('connected successfully to mongo server');
        }
        catch (_a) {
            yield mongoose_1.default.disconnect();
            console.log('connect error to mongo server');
        }
    });
}
exports.runMongo = runMongo;
function clear_db_mongo() {
    return __awaiter(this, void 0, void 0, function* () {
        const asyncArray = [
            yield blogs_scheme_1.blogsModel.deleteMany({}),
            yield posts_scheme_1.postsModel.deleteMany({}),
            yield users_scheme_1.usersModel.deleteMany({}),
            yield comments_scheme_1.commentsModel.deleteMany({}),
            yield rate_limit_scheme_1.rateLimitModel.deleteMany({}),
            yield devices_sessions_scheme_1.devicesSessionsModel.deleteMany({}),
            yield likes_scheme_1.likesStatusModel.deleteMany({}),
        ];
        yield Promise.all(asyncArray);
        return true;
    });
}
exports.clear_db_mongo = clear_db_mongo;
//# sourceMappingURL=db_mongo.js.map