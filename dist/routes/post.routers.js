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
const interface_html_code_1 = require("../dto/interface.html-code");
const interface_pagination_1 = require("../dto/interface.pagination");
const jwt_auth_middleware_1 = require("../middleware/jwt-auth-middleware");
const comments_validations_1 = require("../middleware/validation/comments-validations");
const query_posts_repository_1 = require("../repositories/query-posts-repository");
const query_comment_repository_1 = require("../repositories/query-comment-repository");
const comment_service_1 = require("../domain/comment-service");
exports.postRouters = (0, express_1.Router)({});
class PostController {
    constructor() {
        this.queryPostsRepository = new query_posts_repository_1.QueryPostsRepositoryClass;
        this.queryCommentRepository = new query_comment_repository_1.QueryCommentRepositoryClass;
        this.commentService = new comment_service_1.CommentServiceClass;
    }
    // GETs
    getAllPosts(req, res) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.queryPostsRepository.getAllPosts(((_a = req.query) === null || _a === void 0 ? void 0 : _a.pageNumber) && Number(req.query.pageNumber), ((_b = req.query) === null || _b === void 0 ? void 0 : _b.pageSize) && Number(req.query.pageSize), ((_c = req.query) === null || _c === void 0 ? void 0 : _c.sortDirection) === 'asc' ? interface_pagination_1.SortType.asc : interface_pagination_1.SortType.desc, ((_d = req.query) === null || _d === void 0 ? void 0 : _d.sortBy) && req.query.sortBy);
            if (posts !== null) {
                res.status(interface_html_code_1.HttpStatusCode.OK).send(posts);
            }
            else
                res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
        });
    }
    getPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const findPost = yield this.queryPostsRepository.getPostById(req.params.id);
            if (findPost !== null) {
                res.status(interface_html_code_1.HttpStatusCode.OK).send(findPost);
            }
            else
                res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
        });
    }
    getCommentsByPostId(req, res) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const comments = yield this.queryCommentRepository.getCommentsByPostId(req.params.postId, ((_a = req.query) === null || _a === void 0 ? void 0 : _a.pageNumber) && Number(req.query.pageNumber), ((_b = req.query) === null || _b === void 0 ? void 0 : _b.pageSize) && Number(req.query.pageSize), ((_c = req.query) === null || _c === void 0 ? void 0 : _c.sortDirection) === 'asc' ? interface_pagination_1.SortType.asc : interface_pagination_1.SortType.desc, ((_d = req.query) === null || _d === void 0 ? void 0 : _d.sortBy) && req.query.sortBy);
            if (comments !== null) {
                res.status(interface_html_code_1.HttpStatusCode.OK).send(comments);
            }
            else {
                res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
            }
        });
    }
    // POSTs
    postCommentByPostId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdComment = yield this.commentService.postComment(req.params.postId, req.user, req.body);
            if (createdComment) {
                res.status(201).send(createdComment);
            }
            else {
                res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
            }
        });
    }
    postPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdPost = yield post_service_1.postsService.postPost(req.body);
            res.status(interface_html_code_1.HttpStatusCode.CREATED).send(createdPost);
        });
    }
    putPostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postPost = yield post_service_1.postsService.putPost(req.body, req.params.id);
            if (postPost !== null) {
                res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
            }
            else
                res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
        });
    }
    deletePostById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletePost = yield post_service_1.postsService.deletePost(req.params.id);
            if (deletePost !== null) {
                res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
            }
            else
                res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
        });
    }
}
const postController = new PostController();
exports.postRouters.get('/', postController.getAllPosts.bind(postController));
exports.postRouters.get('/:id', postController.getPostById.bind(postController));
exports.postRouters.get('/:postId/comments', postController.getCommentsByPostId.bind(postController));
exports.postRouters.post('/:postId/comments', jwt_auth_middleware_1.authMiddleware, comments_validations_1.createCommentValidation, postController.postCommentByPostId.bind(postController));
exports.postRouters.post('/', basic_auth_middleware_1.basic_auth, posts_validation_1.createPostValidation, postController.postPost);
exports.postRouters.put('/:id', basic_auth_middleware_1.basic_auth, posts_validation_1.updatePostValidation, postController.putPostById);
exports.postRouters.delete('/:id', basic_auth_middleware_1.basic_auth, postController.deletePostById);
//# sourceMappingURL=post.routers.js.map