"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouters = void 0;
const express_1 = require("express");
const basic_auth_middleware_1 = require("../middleware/basic-auth-middleware");
const posts_repository_1 = require("../repositories/posts-repository");
const posts_validation_1 = require("../middleware/validation/posts-validation");
exports.postRouters = (0, express_1.Router)({});
exports.postRouters.get('/', (req, res) => {
    res.status(200).send(posts_repository_1.postsRepository.getAllPosts());
});
exports.postRouters.get('/:id', (req, res) => {
    let findPost = posts_repository_1.postsRepository.getPostById(req.params.id);
    if (typeof findPost !== "number") {
        res.status(200).send(findPost);
    }
    else
        res.sendStatus(404);
});
exports.postRouters.post('/', basic_auth_middleware_1.basic_auth, posts_validation_1.createPostValidation, (req, res) => {
    const newPost = posts_repository_1.postsRepository.postPost(req.body);
    res.status(201).send(newPost);
});
exports.postRouters.put('/:id', basic_auth_middleware_1.basic_auth, posts_validation_1.updatePostValidation, (req, res) => {
});
exports.postRouters.delete('/:id', basic_auth_middleware_1.basic_auth, (req, res) => {
});
//# sourceMappingURL=post.routers.js.map