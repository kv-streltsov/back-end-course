"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRouters = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
const video_validator_1 = require("../video/video.validator");
const video_post_create_1 = require("../video/video.post.create");
const video_put_update_1 = require("../video/video.put.update");
const video_delete_del_1 = require("../video/video.delete.del");
exports.videoRouters = (0, express_1.Router)({});
exports.videoRouters.get('/', (req, res) => {
    res.status(200).send(db_1.video_list);
});
exports.videoRouters.get('/:id', (req, res) => {
    let video = db_1.video_list.find(video => video.id === +req.params.id);
    if (!video) {
        res.send(404);
        return;
    }
    res.status(200).send(video);
});
//
exports.videoRouters.post('/', (req, res) => {
    let valid = (0, video_validator_1.videoValidator)(req.body, req.method);
    valid === true ?
        res.status(201).send((0, video_post_create_1.videoPostCreate)(req.body)) :
        res.status(400).send(valid);
});
exports.videoRouters.put('/:id', (req, res) => {
    let valid = (0, video_validator_1.videoValidator)(req.body, req.method);
    if (valid === true) {
        let upDateVideo = (0, video_put_update_1.videoPutUpdate)(req.params.id, req.body);
        if (upDateVideo)
            res.send(204);
        else
            res.send(404);
    }
    else
        res.status(400).send(valid);
});
exports.videoRouters.delete('/:id', (req, res) => {
    (0, video_delete_del_1.videoDeleteDel)(req.params.id) ? res.sendStatus(204) : res.sendStatus(404);
});
