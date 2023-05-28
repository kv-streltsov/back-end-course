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
exports.postComments = void 0;
const express_1 = require("express");
const jwt_auth_middleware_1 = require("../middleware/jwt-auth-middleware");
const query_comment_repository_1 = require("../repositories/query-comment-repository");
const interface_html_code_1 = require("../dto/interface.html-code");
const comment_service_1 = require("../domain/comment-service");
const comments_validations_1 = require("../middleware/validation/comments-validations");
exports.postComments = (0, express_1.Router)({});
exports.postComments.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const comment = yield query_comment_repository_1.queryCommentRepository.getCommentById(req.params.id);
    if (comment) {
        res.status(200).send(comment);
    }
    else {
        res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
    }
}));
exports.postComments.put('/:id', jwt_auth_middleware_1.authMiddleware, comments_validations_1.createCommentValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.commentService.putComment(req.params.id, req.user, req.body);
    if (result === 'forbidden') {
        res.sendStatus(interface_html_code_1.HttpStatusCode.FORBIDDEN);
    }
    if (result === true) {
        res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
    }
    else {
        res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
    }
}));
exports.postComments.delete('/:id', jwt_auth_middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield comment_service_1.commentService.deleteComment(req.params.id, req.user);
    if (result === 'forbidden') {
        res.sendStatus(interface_html_code_1.HttpStatusCode.FORBIDDEN);
    }
    if (result === true) {
        res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
    }
    else {
        res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
    }
}));
//# sourceMappingURL=comments.routers.js.map