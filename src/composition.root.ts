import {UsersRepositoryClass} from "./repositories/users-repository";
import {QueryUsersRepositoryClass} from "./repositories/query-users-repository";
import {UsersServiceClass} from "./domain/user-service";
import {UserController} from "./controllers/user.controller";
import {JwtServiceClass} from "./application/jwt-service";

import * as dotenv from "dotenv";
import {AuthController} from "./controllers/auth.controller";
import {BlogController} from "./controllers/blog.controller";
import {QueryBlogsRepositoryClass} from "./repositories/query-blogs-repository";
import {BlogsRepositoryClass} from "./repositories/blogs-repository";
import {BlogsServiceClass} from "./domain/blog-service";
import {QueryCommentRepositoryClass} from "./repositories/query-comment-repository";
import {QueryLikeStatusRepositoryClass} from "./repositories/query-like-status-repository";
import {CommentServiceClass} from "./domain/comment-service";
import {CommentsRepositoryClass} from "./repositories/comments-repository";
import {QueryPostsRepositoryClass} from "./repositories/query-posts-repository";
import {CommentController} from "./controllers/comment.controller";
import {LikeStatusServiceClass} from "./domain/like-status-service";
import {LikeStatusRepositoryClass} from "./repositories/like-status-repository";
import {PostController} from "./controllers/post.controller";
import {postsService} from "./domain/post-service";
dotenv.config()

export const COOKIE_SECURE: boolean = process.env.COOKIE_SECURE === null ? false : process.env.COOKIE_SECURE === 'true';

 // JWT //
export const jwtService = new JwtServiceClass()



// REPOSITORY //
const commentsRepository = new CommentsRepositoryClass()
const likeStatusRepository = new LikeStatusRepositoryClass()
const usersRepository = new UsersRepositoryClass()
const queryUsersRepository = new QueryUsersRepositoryClass()
const queryBlogsRepository = new QueryBlogsRepositoryClass()
const queryPostsRepository = new QueryPostsRepositoryClass()
const queryLikeStatusRepository = new QueryLikeStatusRepositoryClass()
const queryCommentRepository = new QueryCommentRepositoryClass(queryLikeStatusRepository)
const blogsRepository = new BlogsRepositoryClass()
// SERVICES
const blogsService = new BlogsServiceClass(blogsRepository)
const likeStatusService = new LikeStatusServiceClass(likeStatusRepository,queryCommentRepository)
const commentService = new CommentServiceClass(commentsRepository,queryPostsRepository,queryCommentRepository)


// CONTROLLERS //
export const commentController = new CommentController(queryCommentRepository,commentService,likeStatusService,queryLikeStatusRepository)
export const usersService = new UsersServiceClass(usersRepository)
export const userController = new UserController(usersService, queryUsersRepository)
export const authController = new AuthController(COOKIE_SECURE,usersService)
export const blogController = new BlogController(queryBlogsRepository,blogsService)
export const postController = new PostController(queryCommentRepository,queryPostsRepository,commentService,queryLikeStatusRepository,postsService)


