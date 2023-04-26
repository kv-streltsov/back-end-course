"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoDeleteDel = void 0;
const db_1 = require("../db/db");
function videoDeleteDel(id) {
    let check_id = false;
    db_1.video_list.forEach((value, index) => {
        if (value.id == +id) {
            check_id = true;
            db_1.video_list.splice(index, 1);
        }
    });
    return check_id;
}
exports.videoDeleteDel = videoDeleteDel;
