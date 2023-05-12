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
exports.blogRouters = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const basic_auth_middleware_1 = require("../middleware/basic-auth-middleware");
const blogs_validations_1 = require("../middleware/validation/blogs-validations");
exports.blogRouters = (0, express_1.Router)({});
exports.blogRouters.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send(yield blogs_repository_1.blogsRepository.getAllBlogs());
}));
exports.blogRouters.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findBlog = yield blogs_repository_1.blogsRepository.findBlogById(req.params.id);
    if (findBlog !== null) {
        res.status(200).send(findBlog);
    }
    else
        res.sendStatus(404);
}));
exports.blogRouters.post('/', basic_auth_middleware_1.basic_auth, blogs_validations_1.createBlogValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdBlog = yield blogs_repository_1.blogsRepository.postBlog(req.body);
    res.status(201).send(createdBlog);
}));
exports.blogRouters.put('/:id', basic_auth_middleware_1.basic_auth, blogs_validations_1.updateBlogValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postBlog = yield blogs_repository_1.blogsRepository.putBlog(req.body, req.params.id);
    if (postBlog !== null) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
exports.blogRouters.delete('/:id', basic_auth_middleware_1.basic_auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteBlog = yield blogs_repository_1.blogsRepository.deleteBlog(req.params.id);
    if (deleteBlog !== null) {
        res.sendStatus(204);
    }
    else
        res.sendStatus(404);
}));
//# sourceMappingURL=blog.routers.js.map