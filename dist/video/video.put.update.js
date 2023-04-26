"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoPutUpdate = void 0;
const db_1 = require("../db/db");
function videoPutUpdate(id, body) {
    let check_id = false;
    for (const video of db_1.video_list) {
        if (video.id === +id) {
            check_id = true;
            for (const bodyElement in body) {
                video[bodyElement] = body[bodyElement];
            }
        }
    }
    return check_id;
}
exports.videoPutUpdate = videoPutUpdate;
