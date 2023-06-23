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
exports.blogsService = void 0;
const blogs_repository_1 = require("../repositories/blogs-repository");
class BlogsServiceClass {
    constructor() {
        this.blogsRepository = new blogs_repository_1.BlogsRepositoryClass();
    }
    postBlog(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blogsRepository.postBlog(body);
        });
    }
    postPostInBlog(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blogsRepository.postPostInBlog(id, body);
        });
    }
    putBlog(body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blogsRepository.putBlog(body, id);
        });
    }
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.blogsRepository.deleteBlog(id);
        });
    }
}
exports.blogsService = new BlogsServiceClass();
//# sourceMappingURL=blog-service.js.map