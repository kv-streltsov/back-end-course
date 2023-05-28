import request from 'supertest'
import {app} from "../src";
import {InterfaceBlogInput} from "../src/dto/interface.blog";
import {InterfacePostInput} from "../src/dto/interface.post";
import {runInNewContext} from "vm";
import {InterfaceCommentInput, InterfaceCommentView} from "../src/dto/interface.comment";

const validInputBlog: InterfaceBlogInput = {
    "name": "testBlog",
    "description": "string",
    "websiteUrl": "https://www.youtube.com/watch?v=M87UVXSLu6g&list=PL3iZKbiI2YtfVddy96Gw7V7k20alD2-NJ&index=18&ab_channel=PsychedelicExperience"
}
const validInputPost: InterfacePostInput = {
    title: "testPost",
    blogId: "string",
    content: "testPost",
    shortDescription: "testPost"
}
const comment: InterfaceCommentInput = {
    "content": "dfdsfsdfsdfsdfsdfsdfsdfsdfqweqwe"
}
const commentIncorrect: InterfaceCommentInput = {
    "content": "111"
}
const user = {
    "login": "testLogin",
    "password": "qwerty1",
    "email": "test@google.ru"
}

let postId: string
let commentId: string
let newUser: any
let errUser: any
let errUserToken: any
let token: any
describe('/blogs', () => {
    ///////////////////////////////////// BLOG AND POST/////////////////////////////////////////
    it('BLOG create;', async () => {
        const requestTest = await request(app)
            .post('/blogs')
            .auth("admin", "qwerty")
            .send(validInputBlog)
            .expect(201)
        validInputPost.blogId = requestTest.body.id
    });
    it('POST create', async () => {
        const requestTest = await request(app)
            .post('/posts')
            .auth("admin", "qwerty")
            .send(validInputPost)
            .expect(201)

        postId = requestTest.body.id
    });
    //////////////////////////////////////   USER     ///////////////////////////////////////////
    it('USER create', async () => {
        newUser = await request(app)
            .post('/users')
            .auth("admin", "qwerty")
            .send(user)
            .expect(201)
    });
    it('GET TOKEN should return token ', async () => {
        const result = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": newUser.body.login,
                "password": "qwerty1"
            })
            .expect(200)
        token = result.body.accessToken


    });
    //////////////////////////////////////   COMMENT     ///////////////////////////////////////////
    it('CREATED comments ', async () => {
        const newComment = await request(app)
            .post(`/posts/${postId}/comments`)
            .auth(token, {type: "bearer"})
            .send(comment)
            .expect(201)
        commentId = newComment.body.id
    });
    it('GET comments in post | should return 200 ', async () => {
        await request(app)
            .get(`/posts/${postId}/comments`)
            .expect(200)
    });
    it('GET comments by ID | should return 200 ', async () => {
        await request(app)
            .get(`/comments/${commentId}`)
            .expect(200)
    });
    it('PUT comments by ID | should return 204 ', async () => {
        await request(app)
            .put(`/comments/${commentId}`)
            .auth(token, {type: "bearer"})
            .send({"content": "iopoipuiopuiopuiopiuoppio1"})
            .expect(204)
    });
    it('DELETE comments by ID | should return 204 ', async () => {
        await request(app)
            .delete(`/comments/${commentId}`)
            .auth(token, {type: "bearer"})
            .expect(204)
    });
    //////////////////////////////////////   ERROR     ///////////////////////////////////////////
    it('GET TOKEN incorrect values | should return 400', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": 1,
                "password": 2
            })
            .expect(400)


    });
    it('GET TOKEN incorrect password | should return 401', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": newUser.body.login,
                "password": "qwerty2"
            })
            .expect(401)


    });
    it('CREATED comments postId doesnt exists | should return 404', async () => {
        await request(app)
            .post(`/posts/666666/comments`)
            .auth(token, {type: "bearer"})
            .send(comment)
            .expect(404)
    });
    it('CREATED comments Unauthorized | should return 401', async () => {
        await request(app)
            .post(`/posts/${postId}/comments`)
            .send(comment)
            .expect(401)
    });
    it('CREATED comments  incorrect values | should return 400', async () => {
        await request(app)
            .post(`/posts/${postId}/comments`)
            .auth(token, {type: "bearer"})
            .send(commentIncorrect)
            .expect(400)
    });
    ///////////////////////////////////////////////////////////////////////////////////////////////////////
    it('PUT comments by ID incorrect values | should return 400 ', async () => {
        await request(app)
            .put(`/comments/${commentId}`)
            .auth(token, {type: "bearer"})
            .send({"content": "111"})
            .expect(400)
    });
    it('PUT comments by ID Unauthorized | should return 401 ', async () => {
        await request(app)
            .put(`/comments/${commentId}`)
            .send({"content": "111"})
            .expect(401)
    });
    it('PUT comments by ID  comment that is not your own | should return 403 ', async () => {
        errUser = await request(app)
            .post('/users')
            .auth("admin", "qwerty")
            .send({
                "login": "testError",
                "password": "qwerty1",
                "email": "error@google.ru"
            })

        errUserToken = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": errUser.body.login,
                "password": "qwerty1"
            })

        const newComment = await request(app)
            .post(`/posts/${postId}/comments`)
            .auth(token, {type: "bearer"})
            .send(comment)
            .expect(201)
        commentId = newComment.body.id


        await request(app)
            .put(`/comments/${commentId}`)
            .auth(errUserToken.body.accessToken, {type: "bearer"})
            .send({"content": "qweqweqweqwqweqweqweeqwe"})
            .expect(403)
    });
    it('PUT comments by ID doesnt exists | should return 404 ', async () => {
        await request(app)
            .put(`/comments/00000`)
            .auth(token, {type: "bearer"})
            .send({"content": "iopoipuiopuiopuiopiuoppio1"})
            .expect(404)
    });
    it('GET comments by ID doesnt exists | should return 404 ', async () => {
        await request(app)
            .get(`/comments/0000}`)
            .expect(404)
    });
    it('DELETE comments by ID Unauthorized | should return 401 ', async () => {
        await request(app)
            .delete(`/comments/${commentId}`)
            .expect(401)
    });
    it('DELETE comments by ID comment that is not your own | should return 403 ', async () => {
        await request(app)
            .delete(`/comments/${commentId}`)
            .auth(errUserToken.body.accessToken, {type: "bearer"})
            .expect(403)
    });
    it('DELETE comments by ID doesnt exists | should return 404 ', async () => {
        await request(app)
            .delete(`/comments/00000`)
            .auth(token, {type: "bearer"})
            .expect(404)
    });


})




