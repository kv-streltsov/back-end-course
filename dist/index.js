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
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const dotenv = __importStar(require("dotenv"));
const video_routers_1 = require("./routes/video.routers");
const testing_router_1 = require("./routes/testing.router");
const blog_routers_1 = require("./routes/blog.routers");
const post_routers_1 = require("./routes/post.routers");
const db_mongo_1 = require("./db/db_mongo");
dotenv.config();
exports.app = (0, express_1.default)();
const port = process.env.DEV_PORT || 5001;
exports.app.use(express_1.default.json());
exports.app.use('/videos', video_routers_1.videoRouters);
exports.app.use('/blogs', blog_routers_1.blogRouters);
exports.app.use('/posts', post_routers_1.postRouters);
exports.app.use('/testing/all-data', testing_router_1.testingRouter);
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_mongo_1.runMongo)();
    if (process.env.NODE_ENV !== 'test') {
        exports.app.listen(port, () => {
            console.log(`Example app listening on port ${port}`);
        });
    }
});
startApp();
//# sourceMappingURL=index.js.map