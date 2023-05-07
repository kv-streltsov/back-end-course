"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogRouters = void 0;
const express_1 = require("express");
const blogs_repository_1 = require("../repositories/blogs-repository");
const basic_auth_middleware_1 = require("../middleware/basic-auth-middleware");
const blogs_validations_1 = require("../middleware/validation/blogs-validations");
exports.blogRouters = (0, express_1.Router)({});
exports.blogRouters.get('/', (req, res) => {
    res.status(200).send(blogs_repository_1.blogsRepository.getAllBlogs());
});
exports.blogRouters.get('/:id', (req, res) => {
    const findBlog = blogs_repository_1.blogsRepository.findBlogById(req.params.id);
    if (typeof findBlog !== "number") {
        res.status(200).send(findBlog);
    }
    else
        res.sendStatus(404);
});
exports.blogRouters.post('/', basic_auth_middleware_1.basic_auth, blogs_validations_1.createBlogValidation, (req, res) => {
    const newBlog = blogs_repository_1.blogsRepository.postBlog(req.body);
    res.status(201).send(newBlog);
});
exports.blogRouters.put('/:id', basic_auth_middleware_1.basic_auth, blogs_validations_1.updateBlogValidation, (req, res) => {
    res.sendStatus(blogs_repository_1.blogsRepository.putBlog(req.body, req.params.id));
});
exports.blogRouters.delete('/:id', basic_auth_middleware_1.basic_auth, (req, res) => {
    res.sendStatus(blogs_repository_1.blogsRepository.deleteBlog(req.params.id));
});
//# sourceMappingURL=blog.routers.js.map