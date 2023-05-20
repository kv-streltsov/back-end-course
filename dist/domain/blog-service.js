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
exports.blogsService = {
    postBlog: (body) => __awaiter(void 0, void 0, void 0, function* () {
        return blogs_repository_1.blogsRepository.postBlog(body);
    }),
    postPostInBlog: (id, body) => __awaiter(void 0, void 0, void 0, function* () {
        return blogs_repository_1.blogsRepository.postPostInBlog(id, body);
    }),
    putBlog: (body, id) => __awaiter(void 0, void 0, void 0, function* () {
        return blogs_repository_1.blogsRepository.putBlog(body, id);
    }),
    deleteBlog: (id) => __awaiter(void 0, void 0, void 0, function* () {
        return blogs_repository_1.blogsRepository.deleteBlog(id);
    })
};
//# sourceMappingURL=blog-service.js.map