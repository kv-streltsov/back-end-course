"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRepository = void 0;
const db_1 = require("../db/db");
const video_validator_1 = require("../video/video.validator");
const video_post_create_1 = require("../video/video.post.create");
const video_put_update_1 = require("../video/video.put.update");
const video_delete_del_1 = require("../video/video.delete.del");
exports.videoRepository = {
    getAllVideo() {
        return db_1.video_list;
    },
    findVideoById(id) {
        let findVideo = db_1.video_list.find(video => video.id === +id);
        if (!findVideo) {
            return 404;
        }
        else
            return findVideo;
    },
    postVideo(body, method) {
        let valid = (0, video_validator_1.videoValidator)(body, method);
        if (valid)
            return (0, video_post_create_1.videoPostCreate)(body);
        else
            return 400;
    },
    putVideo(id, body, method) {
        let valid = (0, video_validator_1.videoValidator)(body, method);
        if (valid === true) {
            let upDateVideo = (0, video_put_update_1.videoPutUpdate)(id, body);
            if (upDateVideo)
                return 204;
            else
                return 404;
        }
        else
            return valid;
    },
    deleteVideo(id) {
        let delVideo = (0, video_delete_del_1.videoDeleteDel)(id);
        if (delVideo)
            return 204;
        return 404;
    }
};
