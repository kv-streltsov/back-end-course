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
exports.commentsRouter = void 0;
const express_1 = require("express");
const jwt_auth_middleware_1 = require("../middleware/jwt-auth-middleware");
const query_comment_repository_1 = require("../repositories/query-comment-repository");
const interface_html_code_1 = require("../dto/interface.html-code");
const comments_validations_1 = require("../middleware/validation/comments-validations");
const comment_service_1 = require("../domain/comment-service");
const like_status_service_1 = require("../domain/like-status-service");
exports.commentsRouter = (0, express_1.Router)({});
class CommentController {
    constructor() {
        this.queryCommentRepository = new query_comment_repository_1.QueryCommentRepositoryClass;
        this.commentService = new comment_service_1.CommentServiceClass;
        this.likeStatusService = new like_status_service_1.LikeStatusServiceClass;
    }
    getCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.queryCommentRepository.getCommentById(req.params.commentId);
            if (comment) {
                return res.status(200).send(comment);
            }
            else {
                return res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
            }
        });
    }
    putCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentService.putComment(req.params.id, req.user, req.body);
            if (result === 'forbidden') {
                return res.sendStatus(interface_html_code_1.HttpStatusCode.FORBIDDEN);
            }
            if (result === true) {
                return res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
            }
            else {
                return res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
            }
        });
    }
    deleteCommentById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentService.deleteComment(req.params.id, req.user);
            if (result === 'forbidden') {
                return res.sendStatus(interface_html_code_1.HttpStatusCode.FORBIDDEN);
            }
            if (result === true) {
                return res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
            }
            else {
                return res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
            }
        });
    }
    putLikeStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.likeStatusService.putLikeStatus(req.user.id, req.params.commentId, req.body.likeStatus);
            res.sendStatus(204);
        });
    }
}
const commentController = new CommentController();
exports.commentsRouter.get('/:id', commentController.getCommentById.bind(commentController));
exports.commentsRouter.put('/:id', jwt_auth_middleware_1.authMiddleware, comments_validations_1.createCommentValidation, commentController.putCommentById);
exports.commentsRouter.put('/:commentId/like-status', jwt_auth_middleware_1.authMiddleware, commentController.putLikeStatus.bind(commentController));
exports.commentsRouter.delete('/:id', jwt_auth_middleware_1.authMiddleware, commentController.deleteCommentById);
//# sourceMappingURL=comments.routers.js.map