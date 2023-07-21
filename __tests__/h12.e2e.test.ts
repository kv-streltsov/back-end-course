import request from 'supertest'
import {app} from "../src";


const userOne = {
    "login": "qwertya",
    "password": "qwertya",
    "email": "aaa@yandex.ru",
    id: null,
    accessToken: null,
}
const userTwo = {
    "login": "qwertyb",
    "password": "qwertyb",
    "email": "bbb@yandex.ru",
    id: null,
    accessToken: null,
}
const userThree = {
    "login": "qwertyc",
    "password": "qwertyc",
    "email": "ccc@yandex.ru",
    id: null,
    accessToken: null,
}
const userFour = {
    "login": "qwertyd",
    "password": "qwertyd",
    "email": "ddd@yandex.ru",
    id: null,
    accessToken: null,
}

let postId: any
let postSecondId: any

describe('/12 like posts', () => {
    /////////////////////////////    REPARATION    /////////////////////////////////////////
    it('DELETE ALL DATA', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    }, 100000);
    it('CREATE FOUR USERS', async () => {

        // USER 1
        let response = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(userOne)
            .expect(201)
        userOne.id = response.body.id

        // USER 2
        response = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(userTwo)
            .expect(201)
        userTwo.id = response.body.id

        // USER 3
        response = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(userThree)
            .expect(201)
        userThree.id = response.body.id

        // USER 4
        response = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(userFour)
            .expect(201)
        userFour.id = response.body.id

    });
    it('LOGIN FOUR USERS | should return JWT Pair ', async () => {

        /// LOGIN USER ///

        // LOGIN USER 1
        let response = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": userOne.email,
                "password": userOne.password
            }).expect(200)
        userOne.accessToken = response.body.accessToken

        // LOGIN USER 2
        response = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": userTwo.email,
                "password": userTwo.password
            }).expect(200)
        userTwo.accessToken = response.body.accessToken

        // LOGIN USER 3
        response = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": userThree.email,
                "password": userThree.password
            }).expect(200)
        userThree.accessToken = response.body.accessToken

        // LOGIN USER 4
        response = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": userFour.email,
                "password": userFour.password
            }).expect(200)
        userFour.accessToken = response.body.accessToken


    });
    it('CREATE BLOG -> POST ', async () => {

        // CREATE NEW BLOG
        const blog = await request(app)
            .post(`/blogs`)
            .auth('admin', 'qwerty')
            .send({
                "name": "testBlog",
                "description": "testBlog description testBlog description  testBlog test description",
                "websiteUrl": "https://www.youtube.com/testBlog"
            }).expect(201)

        // CREATE POSTS
        const post = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send({
                title: 'it test test post',
                blogId: blog.body.id,
                content: 'test post content',
                shortDescription: 'shortDescription test post'
            }).expect(201)

        expect(post.body).toEqual({
            id: post.body.id,
            createdAt: expect.any(String),
            blogName: 'testBlog',
            title: 'it test test post',
            blogId: blog.body.id,
            content: 'test post content',
            shortDescription: 'shortDescription test post',
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: []
            }
        })


        // CREATE SECOND POSTS VIA ENDPOINT BLOG
        const postSecond = await request(app)
            .post(`/blogs/${blog.body.id}/posts`)
            .auth('admin', 'qwerty')
            .send({
                title: 'it test test post',
                blogId: blog.body.id,
                content: 'test post content',
                shortDescription: 'shortDescription test post'
            }).expect(201)

        expect(postSecond.body).toEqual({
            id: postSecond.body.id,
            createdAt: expect.any(String),
            blogName: 'testBlog',
            title: 'it test test post',
            blogId: blog.body.id,
            content: 'test post content',
            shortDescription: 'shortDescription test post',
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None',
                newestLikes: []
            }
        })

        postId = post.body.id
        postSecondId = postSecond.body.id








    });
    /////////////////////////////    POST LIKE FLOW    /////////////////////////////////////////
    it('ERROR 400 / 404', async () => {
        // PUSH LIKE | comment id incorrect | SHOULD RETURN 404
        await request(app)
            .put(`/posts/${111}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(404)
        // PUSH LIKE | status incorrect | SHOULD RETURN 401
        const error = await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Likee"})
            .expect(400)


        expect(error.body).toEqual({
            errorsMessages: [{message: 'Invalid value', field: 'likeStatus'}]
        })

    });
    it('PUSH 2 LIKE AND 2 DISLIKE IN FIRST POST', async () => {

        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('Authorization', `Bearer ${userThree.accessToken}`)
            .send({"likeStatus": "Dislike"})
            .expect(204)

        await request(app)
            .put(`/posts/${postId}/like-status`)
            .set('Authorization', `Bearer ${userFour.accessToken}`)
            .send({"likeStatus": "Dislike"})
            .expect(204)

    });
    it('GET LIKE STATUS FIRST POST', async () => {

        // FIRST USER GET COMMENT | SHOULD RETURN 2 LIKE 2 DISLIKE AND MY STATUS `Like`
        let post = await request(app)
            .get(`/posts/${postId}`)
            .set('Authorization', `Bearer ${userOne.accessToken}`).expect(200)


        expect(post.body).toEqual({
            id: postId,
            content: 'test post content',
            blogId: expect.any(String),
            blogName: expect.any(String),
            createdAt: expect.any(String),
            shortDescription: "shortDescription test post",
            title: "it test test post",
            extendedLikesInfo: {
                likesCount: 2,
                dislikesCount: 2,
                myStatus: "Like",
                newestLikes: [
                    {
                        addedAt: expect.any(String),
                        userId: expect.any(String),
                        login: expect.any(String),
                    },
                    {
                        addedAt: expect.any(String),
                        userId: expect.any(String),
                        login: expect.any(String),
                    },
                    {
                        addedAt: expect.any(String),
                        userId: expect.any(String),
                        login: expect.any(String),
                    }
                ]
            }

        })



    });
    it('PUSH 4 LIKE IN SECOND POST AND GET LIKE STATUS', async () => {
        console.log(`userOne.accessToken`, userOne.accessToken)
        await request(app)
            .put(`/posts/${postSecondId}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

        await request(app)
            .put(`/posts/${postSecondId}/like-status`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

        await request(app)
            .put(`/posts/${postSecondId}/like-status`)
            .set('Authorization', `Bearer ${userThree.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

        await request(app)
            .put(`/posts/${postSecondId}/like-status`)
            .set('Authorization', `Bearer ${userFour.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)


    });
})


