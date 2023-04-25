"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = require("./db/db");
const app = (0, express_1.default)();
const port = 3000;
app.get('/videos', (req, res) => {
    res.status(200).send(db_1.video_list);
});
app.get('/videos/:id', (req, res) => {
    let video = db_1.video_list.find(video => video.id == parseInt(req.params.id));
    video === undefined ? res.send(404) : res.status(200).send(video);
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
