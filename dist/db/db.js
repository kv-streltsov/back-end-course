"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clear_db = exports.video_list = void 0;
const interface_video_1 = require("../dto/interface.video");
exports.video_list = [
    {
        id: 1,
        title: 'snowboard',
        author: 'kv.streltsov',
        canBeDownloaded: false,
        minAgeRestriction: 18,
        createdAt: '2023-04-25T03:39:35.504Z',
        publicationDate: '2023-04-26T03:39:35.504Z',
        availableResolutions: [interface_video_1.Resolutions.P1080]
    },
    {
        id: 2,
        title: '01 - Back-end Путь Самурая',
        author: 'IT-KAMASUTRA',
        canBeDownloaded: false,
        minAgeRestriction: 12,
        createdAt: '2023-04-10T03:39:35.504Z',
        publicationDate: '2023-04-11T03:39:35.504Z',
        availableResolutions: [interface_video_1.Resolutions.P720]
    }
];
function clear_db() {
    exports.video_list = [];
}
exports.clear_db = clear_db;
