"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRepository = void 0;
const db_local_1 = require("../db/db_local");
const video_validator_1 = require("../controllers/video/video.validator");
const video_post_create_1 = require("../controllers/video/video.post.create");
const video_put_update_1 = require("../controllers/video/video.put.update");
const interface_html_code_1 = require("../dto/interface.html-code");
exports.videoRepository = {
    getAllVideo() {
        return db_local_1.video_list;
    },
    findVideoById(id) {
        let findVideo = db_local_1.video_list.find(video => video.id === +id);
        if (!findVideo) {
            return interface_html_code_1.HttpStatusCode.NOT_FOUND;
        }
        return findVideo;
    },
    postVideo(body, method) {
        let valid = (0, video_validator_1.videoValidator)(body, method);
        if (valid.errorsMessages === undefined)
            return (0, video_post_create_1.videoPostCreate)(body);
        else
            return valid;
    },
    putVideo(id, body, method) {
        let valid = (0, video_validator_1.videoValidator)(body, method);
        if (valid === true) {
            let upDateVideo = (0, video_put_update_1.videoPutUpdate)(id, body);
            if (upDateVideo)
                return interface_html_code_1.HttpStatusCode.NO_CONTENT;
            else
                return interface_html_code_1.HttpStatusCode.NOT_FOUND;
        }
        else
            return valid;
    },
    deleteVideo(id) {
        let findIndexVideo = db_local_1.video_list.findIndex(value => value.id === +id);
        if (findIndexVideo === -1)
            return interface_html_code_1.HttpStatusCode.NOT_FOUND;
        db_local_1.blogs_list.splice(findIndexVideo, 1);
        return interface_html_code_1.HttpStatusCode.NO_CONTENT;
    }
};
//# sourceMappingURL=video-repository.js.map