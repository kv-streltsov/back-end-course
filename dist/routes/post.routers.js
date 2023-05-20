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
const posts_validation_1 = require("../middleware/validation/posts-validation");
const post_service_1 = require("../domain/post-service");
const query_posts_repository_1 = require("../repositories/query-posts-repository");
const interface_html_code_1 = require("../dto/interface.html-code");
exports.postRouters = (0, express_1.Router)({});
exports.postRouters.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const posts = yield query_posts_repository_1.queryPostsRepository.getAllPosts(Number(req.query.pageNumber), ((_a = req.query) === null || _a === void 0 ? void 0 : _a.pageSize) && Number(req.query.pageSize), req.query.sortBy, req.query.sortDirection);
    if (posts !== null) {
        res.status(interface_html_code_1.HttpStatusCode.OK).send(posts);
    }
    else
        res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
}));
exports.postRouters.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findPost = yield query_posts_repository_1.queryPostsRepository.getPostById(req.params.id);
    if (findPost !== null) {
        res.status(interface_html_code_1.HttpStatusCode.OK).send(findPost);
    }
    else
        res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
}));
exports.postRouters.post('/', basic_auth_middleware_1.basic_auth, posts_validation_1.createPostValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdPost = yield post_service_1.postsService.postPost(req.body);
    res.status(interface_html_code_1.HttpStatusCode.CREATED).send(createdPost);
}));
exports.postRouters.put('/:id', basic_auth_middleware_1.basic_auth, posts_validation_1.updatePostValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postPost = yield post_service_1.postsService.putPost(req.body, req.params.id);
    if (postPost !== null) {
        res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
    }
    else
        res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
}));
exports.postRouters.delete('/:id', basic_auth_middleware_1.basic_auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletePost = yield post_service_1.postsService.deletePost(req.params.id);
    if (deletePost !== null) {
        res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
    }
    else
        res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
}));
//# sourceMappingURL=post.routers.js.map