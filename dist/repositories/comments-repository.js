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
exports.commentsRepository = void 0;
const comments_scheme_1 = require("../db/schemes/comments.scheme");
class CommentsRepositoryClass {
    createComment(commentObj) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield comments_scheme_1.commentsModel.create(commentObj);
        });
    }
    updateComment(commentId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            return comments_scheme_1.commentsModel.updateOne({ id: commentId }, { $set: { content: comment } });
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            return comments_scheme_1.commentsModel.deleteOne({ id: commentId });
        });
    }
}
exports.commentsRepository = new CommentsRepositoryClass();
//# sourceMappingURL=comments-repository.js.map