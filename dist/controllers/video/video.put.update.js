"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoPutUpdate = void 0;
const db_1 = require("../../db/db");
function videoPutUpdate(id, body) {
    const videoIndex = db_1.video_list.findIndex(v => v.id === +id);
    const video = db_1.video_list.find(v => v.id === +id);
    if (videoIndex === -1) {
        return false;
    }
    const newVideo = Object.assign(Object.assign({}, video), body);
    db_1.video_list.splice(videoIndex, 1, newVideo);
    return true;
}
exports.videoPutUpdate = videoPutUpdate;
//# sourceMappingURL=video.put.update.js.map