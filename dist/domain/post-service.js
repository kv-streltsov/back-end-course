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
exports.postsService = void 0;
const posts_repository_1 = require("../repositories/posts-repository");
class PostsServiceClass {
    postPost(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return posts_repository_1.postsRepository.postPost(body);
        });
    }
    putPost(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return posts_repository_1.postsRepository.putPost(body, id);
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return posts_repository_1.postsRepository.deletePost(id);
        });
    }
}
exports.postsService = new PostsServiceClass();
//# sourceMappingURL=post-service.js.map