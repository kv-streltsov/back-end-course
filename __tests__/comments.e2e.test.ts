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
const commnet:InterfaceCommentInput ={
    "content":"dfdsfsdfsdfsdfsdfsdfsdfsdfqweqwe"
}
const user = {
    "login": "testLogin",
    "password": "qwerty1",
    "email": "test@google.ru"
}

let postId: string
let newUser:any
let token: string
describe('/blogs', () => {
    ///////////////////////////////////// CREATE BLOG AND POST/////////////////////////////////////////
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
    //////////////////////////////////////  CREATE USER    ///////////////////////////////////////////
    it('USER create', async () => {
        newUser = await request(app)
            .post('/users')
            .auth("admin", "qwerty")
            .send(user)
            .expect(201)
    });
    it('should return token ', async () => {
        const result = await request(app)
            .post('/auth/login').send({
                "loginOrEmail":newUser.body.login,
                "password":"qwerty1"
            })
        token = result.text
    });
    it('CREATED comments ', async () => {
        const newComment = await request(app)
            .post(`/posts/${postId}/comments`)
            .auth(token,{type:"bearer"})
            .send(commnet)
            .expect(201)

    });


})




