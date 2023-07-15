import "reflect-metadata"
import {UsersRepositoryClass} from "./repositories/users-repository";
import {QueryUsersRepositoryClass} from "./repositories/query-users-repository";
import {UsersServiceClass} from "./domain/user-service";
import {UserController} from "./controllers/user.controller";
import {JwtServiceClass} from "./application/jwt-service";
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
import { PostsServiceClass} from "./domain/post-service";
import {SecurityDevicesController} from "./controllers/security.devices.controller";
import * as dotenv from "dotenv";
import {EmailServiceClass} from "./domain/email-service";
import {JwtRepositoryClass} from "./repositories/jwt-repository";
import {Container} from "inversify";
import {PostsRepositoryClass} from "./repositories/posts-repository";

const jwtRepository = new JwtRepositoryClass
const usersRepository = new UsersRepositoryClass()
export const usersService = new UsersServiceClass(usersRepository)
export const jwtService = new JwtServiceClass(usersService,jwtRepository)

export const container = new Container()
// REPOSITORY
container.bind(QueryLikeStatusRepositoryClass).to(QueryLikeStatusRepositoryClass)
container.bind(QueryCommentRepositoryClass).to(QueryCommentRepositoryClass)
container.bind(QueryUsersRepositoryClass).to(QueryUsersRepositoryClass)
container.bind(QueryBlogsRepositoryClass).to(QueryBlogsRepositoryClass)
container.bind(QueryPostsRepositoryClass).to(QueryPostsRepositoryClass)
container.bind(PostsRepositoryClass).to(PostsRepositoryClass)
container.bind(JwtRepositoryClass).to(JwtRepositoryClass)
container.bind(CommentsRepositoryClass).to(CommentsRepositoryClass)
container.bind(LikeStatusRepositoryClass).to(LikeStatusRepositoryClass)
container.bind(UsersRepositoryClass).to(UsersRepositoryClass)
container.bind(BlogsRepositoryClass).to(BlogsRepositoryClass)
// SERVICES
container.bind(PostsServiceClass).to(PostsServiceClass)
container.bind(BlogsServiceClass).to(BlogsServiceClass)
container.bind(LikeStatusServiceClass).to(LikeStatusServiceClass)
container.bind(CommentServiceClass).to(CommentServiceClass)
container.bind(UsersServiceClass).to(UsersServiceClass)
container.bind(JwtServiceClass).to(JwtServiceClass)
container.bind(EmailServiceClass).to(EmailServiceClass)
// CONTROLLERS
container.bind(CommentController).to(CommentController)
container.bind(UserController).to(UserController)
container.bind(AuthController).to(AuthController)
container.bind(SecurityDevicesController).to(SecurityDevicesController)
container.bind(BlogController).to(BlogController)
container.bind(PostController).to(PostController)





