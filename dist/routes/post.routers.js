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
const interface_pagination_1 = require("../dto/interface.pagination");
const jwt_auth_middleware_1 = require("../middleware/jwt-auth-middleware");
const comment_service_1 = require("../domain/comment-service");
const comments_validations_1 = require("../middleware/validation/comments-validations");
const query_comment_repository_1 = require("../repositories/query-comment-repository");
exports.postRouters = (0, express_1.Router)({});
exports.postRouters.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const posts = yield query_posts_repository_1.queryPostsRepository.getAllPosts(((_a = req.query) === null || _a === void 0 ? void 0 : _a.pageNumber) && Number(req.query.pageNumber), ((_b = req.query) === null || _b === void 0 ? void 0 : _b.pageSize) && Number(req.query.pageSize), ((_c = req.query) === null || _c === void 0 ? void 0 : _c.sortDirection) === 'asc' ? interface_pagination_1.SortType.asc : interface_pagination_1.SortType.desc, ((_d = req.query) === null || _d === void 0 ? void 0 : _d.sortBy) && req.query.sortBy);
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
exports.postRouters.get('/:postId/comments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h;
    const comments = yield query_comment_repository_1.queryCommentRepository.getCommentsByPostId(req.params.postId, ((_e = req.query) === null || _e === void 0 ? void 0 : _e.pageNumber) && Number(req.query.pageNumber), ((_f = req.query) === null || _f === void 0 ? void 0 : _f.pageSize) && Number(req.query.pageSize), ((_g = req.query) === null || _g === void 0 ? void 0 : _g.sortDirection) === 'asc' ? interface_pagination_1.SortType.asc : interface_pagination_1.SortType.desc, ((_h = req.query) === null || _h === void 0 ? void 0 : _h.sortBy) && req.query.sortBy);
    if (comments !== null) {
        res.status(interface_html_code_1.HttpStatusCode.OK).send(comments);
    }
    else {
        res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
    }
}));
exports.postRouters.post('/:postId/comments', jwt_auth_middleware_1.authMiddleware, comments_validations_1.createCommentValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdComment = yield comment_service_1.commentService.postComment(req.params.postId, req.user, req.body);
    if (createdComment) {
        res.status(201).send(createdComment);
    }
    else {
        res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
    }
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