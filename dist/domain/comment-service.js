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
exports.commentService = void 0;
const comments_repository_1 = require("../repositories/comments-repository");
const db_mongo_1 = require("../db/db_mongo");
exports.commentService = {
    postComment: (postId, user, comment) => __awaiter(void 0, void 0, void 0, function* () {
        const findPost = yield db_mongo_1.collectionPosts.findOne({ id: postId });
        if (findPost === null) {
            return null;
        }
        const commentObj = {
            id: postId,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            content: comment.content,
            createdAt: new Date().toISOString()
        };
        const newComment = yield comments_repository_1.commentsRepository.createComment(Object.assign({}, commentObj));
        if (newComment.acknowledged) {
            return commentObj;
        }
        return false;
    })
};
//# sourceMappingURL=comment-service.js.map