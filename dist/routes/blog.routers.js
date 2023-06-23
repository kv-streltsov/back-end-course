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
const posts_validation_1 = require("../middleware/validation/posts-validation");
const interface_pagination_1 = require("../dto/interface.pagination");
exports.blogRouters = (0, express_1.Router)({});
class BlogController {
    constructor() {
        this.queryBlogsRepository = new query_blogs_repository_1.QueryBlogsRepositoryClass;
    }
    getAllBlog(req, res) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const blogs = yield this.queryBlogsRepository.getAllBlogs(((_a = req.query) === null || _a === void 0 ? void 0 : _a.pageNumber) && Number(req.query.pageNumber), ((_b = req.query) === null || _b === void 0 ? void 0 : _b.pageSize) && Number(req.query.pageSize), ((_c = req.query) === null || _c === void 0 ? void 0 : _c.sortDirection) === 'asc' ? interface_pagination_1.SortType.asc : interface_pagination_1.SortType.desc, ((_d = req.query) === null || _d === void 0 ? void 0 : _d.sortBy) && req.query.sortBy, ((_e = req.query) === null || _e === void 0 ? void 0 : _e.searchNameTerm) && req.query.searchNameTerm);
            res.status(interface_html_code_1.HttpStatusCode.OK).send(blogs);
        });
    }
    getBlogById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const findBlog = yield this.queryBlogsRepository.getBlogById(req.params.id);
            if (findBlog !== null) {
                res.status(interface_html_code_1.HttpStatusCode.OK).send(findBlog);
            }
            else
                res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
        });
    }
    getPostsByiDBlog(req, res) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield this.queryBlogsRepository.getPostsInBlog(((_a = req.query) === null || _a === void 0 ? void 0 : _a.pageNumber) && Number(req.query.pageNumber), ((_b = req.query) === null || _b === void 0 ? void 0 : _b.pageSize) && Number(req.query.pageSize), ((_c = req.query) === null || _c === void 0 ? void 0 : _c.sortDirection) === 'asc' ? interface_pagination_1.SortType.asc : interface_pagination_1.SortType.desc, ((_d = req.query) === null || _d === void 0 ? void 0 : _d.sortBy) && req.query.sortBy, req.params.id.toString());
            if (posts !== null) {
                res.status(interface_html_code_1.HttpStatusCode.OK).send(posts);
            }
            else
                res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
        });
    }
    postBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdBlog = yield blog_service_1.blogsService.postBlog(req.body);
            res.status(interface_html_code_1.HttpStatusCode.CREATED).send(createdBlog);
        });
    }
    postPostByBlogId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const createdBlog = yield blog_service_1.blogsService.postPostInBlog(req.params.id, req.body);
            if (createdBlog === undefined || createdBlog === null) {
                res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
            }
            else {
                res.status(interface_html_code_1.HttpStatusCode.CREATED).send(createdBlog);
            }
        });
    }
    putBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const postBlog = yield blog_service_1.blogsService.putBlog(req.body, req.params.id);
            if (postBlog !== null) {
                res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
            }
            else
                res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
        });
    }
    deleteBlog(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteBlog = yield blog_service_1.blogsService.deleteBlog(req.params.id);
            if (deleteBlog !== null) {
                res.sendStatus(interface_html_code_1.HttpStatusCode.NO_CONTENT);
            }
            else
                res.sendStatus(interface_html_code_1.HttpStatusCode.NOT_FOUND);
        });
    }
}
const blogController = new BlogController();
exports.blogRouters.get('/', blogController.getAllBlog.bind(blogController));
exports.blogRouters.get('/:id', blogController.getBlogById.bind(blogController));
exports.blogRouters.get('/:id/posts/', blogController.getPostsByiDBlog.bind(blogController));
exports.blogRouters.post('/', basic_auth_middleware_1.basic_auth, blogs_validations_1.createBlogValidation, blogController.postBlog);
exports.blogRouters.post('/:id/posts/', basic_auth_middleware_1.basic_auth, posts_validation_1.createPostInBlogValidation, blogController.postPostByBlogId);
exports.blogRouters.put('/:id', basic_auth_middleware_1.basic_auth, blogs_validations_1.updateBlogValidation, blogController.putBlog);
exports.blogRouters.delete('/:id', basic_auth_middleware_1.basic_auth, blogController.deleteBlog);
//# sourceMappingURL=blog.routers.js.map