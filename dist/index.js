"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db/db");
const video_post_validator_1 = require("./video/video.post.validator");
const video_post_create_1 = require("./video/video.post.create");
const video_put_update_1 = require("./video/video.put.update");
exports.app = (0, express_1.default)();
const port = 5000;
exports.app.use(express_1.default.json());
exports.app.get('/', (req, res) => {
    res.send('Hello');
});
exports.app.get('/videos', (req, res) => {
    res.status(200).send(db_1.video_list);
});
exports.app.get('/videos/:id', (req, res) => {
    let video = db_1.video_list.find(video => video.id === +req.params.id);
    video === undefined ?
        res.send(404) :
        res.status(200).send(video);
});
exports.app.post('/videos', (req, res) => {
    let valid = (0, video_post_validator_1.videoPostValidator)(req.body);
    valid === true ?
        res.status(201).send((0, video_post_create_1.videoPostCreate)(req.body)) :
        res.status(400).send(valid);
});
exports.app.put('/videos/:id', (req, res) => {
    (0, video_put_update_1.videoPutUpdate)(req.params.id, req.body);
    res.send(200);
});
if (process.env.NODE_ENV !== 'test') {
    exports.app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
}
