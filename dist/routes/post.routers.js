"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouters = void 0;
const express_1 = require("express");
const basic_auth_middleware_1 = require("../middleware/basic-auth-middleware");
const posts_repository_1 = require("../repositories/posts-repository");
const posts_validation_1 = require("../middleware/validation/posts-validation");
exports.postRouters = (0, express_1.Router)({});
exports.postRouters.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send(yield posts_repository_1.postsRepository.getAllPosts());
}));
exports.postRouters.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findPost = yield posts_repository_1.postsRepository.getPostById(req.params.id);
    if (findPost !== null) {
        res.status(200).send(findPost);
    }
    else
        res.sendStatus(404);
}));
exports.postRouters.post('/', basic_auth_middleware_1.basic_auth, posts_validation_1.createPostValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const newPost = yield posts_repository_1.postsRepository.postPost(req.body);
    res.status(201).send(newPost);
}));
exports.postRouters.put('/:id', basic_auth_middleware_1.basic_auth, posts_validation_1.updatePostValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postPost = yield posts_repository_1.postsRepository.putPost(req.body, req.params.id);
    if (postPost !== null) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
exports.postRouters.delete('/:id', basic_auth_middleware_1.basic_auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletePost = yield posts_repository_1.postsRepository.deletePost(req.params.id);
    if (deletePost !== null) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
//# sourceMappingURL=post.routers.js.map