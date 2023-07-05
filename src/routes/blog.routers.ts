import {Router} from "express";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {createBlogValidation, updateBlogValidation} from "../middleware/validation/blogs-validations";
import {createPostInBlogValidation} from "../middleware/validation/posts-validation";
import {blogController} from "../composition.root";

export const blogRouters = Router({})


blogRouters.get('/', blogController.getAllBlog.bind(blogController))
blogRouters.get('/:id', blogController.getBlogById.bind(blogController))
blogRouters.get('/:id/posts/', blogController.getPostsByiDBlog.bind(blogController))
blogRouters.post('/', basic_auth, createBlogValidation, blogController.postBlog.bind(blogController));
blogRouters.post('/:id/posts/', basic_auth, createPostInBlogValidation, blogController.postPostByBlogId.bind(blogController));
blogRouters.put('/:id', basic_auth, updateBlogValidation, blogController.putBlog.bind(blogController))
blogRouters.delete('/:id', basic_auth, blogController.deleteBlog.bind(blogController))