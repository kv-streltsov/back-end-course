"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoPutUpdate = void 0;
const db_1 = require("../db/db");
function videoPutUpdate(id, body) {
    db_1.video_list.forEach(value => {
        if (value.id = +id) {
            console.log(value);
        }
    });
    for (const bodyKey in body) {
        // console.log(bodyKey)
    }
}
exports.videoPutUpdate = videoPutUpdate;
