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
const basic_auth_middleware_1 = require("../middleware/basic-auth-middleware");
const blogs_validations_1 = require("../middleware/validation/blogs-validations");
const query_blogs_repository_1 = require("../repositories/query-blogs-repository");
const blog_service_1 = require("../domain/blog-service");
const interface_html_code_1 = require("../dto/interface.html-code");
exports.blogRouters = (0, express_1.Router)({});
exports.blogRouters.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(interface_html_code_1.HttpStatusCode.OK).send(yield query_blogs_repository_1.queryBlogsRepository.getAllBlogs(req.query));
}));
exports.blogRouters.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findBlog = yield query_blogs_repository_1.queryBlogsRepository.getBlogById(req.params.id);
    if (findBlog !== null) {
        res.status(interface_html_code_1.HttpStatusCode.OK).send(findBlog);
    }
    else
        res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
}));
exports.blogRouters.get('/:id/posts/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const findBlog = yield query_blogs_repository_1.queryBlogsRepository.getBlogById(req.params.id);
    if (findBlog !== null) {
        res.status(interface_html_code_1.HttpStatusCode.OK).send(findBlog);
    }
    else
        res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
}));
exports.blogRouters.post('/', basic_auth_middleware_1.basic_auth, blogs_validations_1.createBlogValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createdBlog = yield blog_service_1.blogsService.postBlog(req.body);
    res.status(interface_html_code_1.HttpStatusCode.CREATED).send(createdBlog);
}));
exports.blogRouters.put('/:id', basic_auth_middleware_1.basic_auth, blogs_validations_1.updateBlogValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postBlog = yield blog_service_1.blogsService.putBlog(req.body, req.params.id);
    if (postBlog !== null) {
        res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
    }
    else
        res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
}));
exports.blogRouters.delete('/:id', basic_auth_middleware_1.basic_auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteBlog = yield blog_service_1.blogsService.deleteBlog(req.params.id);
    if (deleteBlog !== null) {
        res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
    }
    else
        res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
}));
//# sourceMappingURL=blog.routers.js.map