"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const video_routers_1 = require("./routes/video.routers");
exports.app = (0, express_1.default)();
const port = 5000;
exports.app.use(express_1.default.json());
exports.app.use('/videos', video_routers_1.videoRouters);
if (process.env.NODE_ENV !== 'test') {
    exports.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}
