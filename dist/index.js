"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db/db");
const video_post_validator_1 = require("./video.post.validator");
exports.app = (0, express_1.default)();
const port = 3000;
exports.app.use(express_1.default.json());
exports.app.get('/videos', (req, res) => {
    res.status(200).send(db_1.video_list);
});
exports.app.get('/videos/:id', (req, res) => {
    let video = db_1.video_list.find(video => video.id === +req.params.id);
    video === undefined ? res.send(404) : res.status(200).send(video);
});
exports.app.post('/videos', (req, res) => {
    let valid = (0, video_post_validator_1.videoPostValidator)(req.body);
    if (valid)
        res.status(400).send(valid);
    else {
        let newVideo = {
            id: db_1.video_list.length + 1,
            title: req.body.title,
            author: req.body.author,
            canBeDownloaded: false,
            minAgeRestriction: 18,
            createdAt: new Date().toISOString(),
            publicationDate: new Date().toISOString(),
        };
        console.log(newVideo);
    }
});
if (process.env.NODE_ENV !== 'test') {
    exports.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}
