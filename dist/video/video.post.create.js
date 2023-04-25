"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoPostCreate = void 0;
const db_1 = require("../db/db");
function videoPostCreate(body) {
    const createVideo = {
        id: db_1.video_list.length + 1,
        title: body.title,
        author: body.author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: body.availableResolutions || null
    };
    db_1.video_list.push(createVideo);
    return createVideo;
}
exports.videoPostCreate = videoPostCreate;
