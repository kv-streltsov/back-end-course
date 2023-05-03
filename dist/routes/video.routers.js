"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoRouters = void 0;
const express_1 = require("express");
const video_repository_1 = require("../repositories/video-repository");
exports.videoRouters = (0, express_1.Router)({});
exports.videoRouters.get('/', (req, res) => {
    let video = video_repository_1.videoRepository.getAllVideo();
    res.status(200).send(video);
});
exports.videoRouters.get('/:id', (req, res) => {
    let findVideo = video_repository_1.videoRepository.findVideoById(req.params.id);
    if (findVideo === 404)
        res.sendStatus(404);
    res.status(200).send(findVideo);
});
//
exports.videoRouters.post('/', (req, res) => {
    let newVideo = video_repository_1.videoRepository.postVideo(req.body, req.method);
    if (newVideo === 400)
        res.sendStatus(400);
    res.status(201).send(newVideo);
});
exports.videoRouters.put('/:id', (req, res) => {
    let putVideo = video_repository_1.videoRepository.putVideo(req.params.id, req.body, req.method);
    if (putVideo === 204)
        res.sendStatus(204);
    if (putVideo === 404)
        res.sendStatus(404);
    else
        res.status(400).send(putVideo);
});
exports.videoRouters.delete('/:id', (req, res) => {
    let delVideo = video_repository_1.videoRepository.deleteVideo(req.params.id);
    if (delVideo === 204)
        res.sendStatus(204);
    else
        res.sendStatus(404);
});
