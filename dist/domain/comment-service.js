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
exports.CommentServiceClass = void 0;
const comments_repository_1 = require("../repositories/comments-repository");
const query_posts_repository_1 = require("../repositories/query-posts-repository");
const query_comment_repository_1 = require("../repositories/query-comment-repository");
class CommentServiceClass {
    constructor() {
        this.commentsRepository = new comments_repository_1.CommentsRepositoryClass;
        this.queryPostsRepository = new query_posts_repository_1.QueryPostsRepositoryClass;
        this.queryCommentRepository = new query_comment_repository_1.QueryCommentRepositoryClass;
    }
    postComment(postId, user, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const findPost = yield this.queryPostsRepository.getPostById(postId);
            if (findPost === null) {
                return null;
            }
            const commentObj = {
                id: new Date().getTime().toString(),
                postId: postId,
                commentatorInfo: {
                    userId: user.id,
                    userLogin: user.login
                },
                content: comment.content,
                createdAt: new Date().toISOString()
            };
            const newComment = yield this.commentsRepository.createComment(Object.assign({}, commentObj));
            if (newComment) {
                return {
                    id: commentObj.id,
                    commentatorInfo: commentObj.commentatorInfo,
                    content: commentObj.content,
                    createdAt: commentObj.createdAt
                };
            }
            return false;
        });
    }
    putComment(commentId, user, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkComment = yield this.queryCommentRepository.getCommentById(commentId);
            if (checkComment === null) {
                return null;
            }
            if (checkComment.commentatorInfo.userId !== user.id) {
                return 'forbidden';
            }
            const result = yield this.commentsRepository.updateComment(commentId, comment.content);
            if (result.matchedCount === 1) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    deleteComment(commentId, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkComment = yield this.queryCommentRepository.getCommentById(commentId);
            if (checkComment === null) {
                return null;
            }
            if (checkComment.commentatorInfo.userId !== user.id) {
                return 'forbidden';
            }
            const result = yield this.commentsRepository.deleteComment(commentId);
            if (result.deletedCount === 1) {
                return true;
            }
            else {
                return false;
            }
        });
    }
}
exports.CommentServiceClass = CommentServiceClass;
// export const commentService = new CommentServiceClass()
//# sourceMappingURL=comment-service.js.map