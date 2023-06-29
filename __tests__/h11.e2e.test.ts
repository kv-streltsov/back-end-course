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

let commentId: any
let commentId2: any


describe('/11', () => {
    /////////////////////////////    REPARATION    /////////////////////////////////////////
    it('DELETE ALL DATA', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    }, 100000);
    it('CREATE THREE USERS', async () => {

        let response = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(userOne)
            .expect(201)
        userOne.id = response.body.id

        response = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(userTwo)
            .expect(201)
        userTwo.id = response.body.id

        response = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(userThree)
            .expect(201)
        userThree.id = response.body.id
    });
    it('LOGIN THREE USERS | should return JWT Pair ', async () => {

        /// LOGIN USER
        let response = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": userOne.email,
                "password": userOne.password
            }).expect(200)
        userOne.accessToken = response.body.accessToken

         response = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": userTwo.email,
                "password": userTwo.password
            }).expect(200)

        userTwo.accessToken = response.body.accessToken

        response = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": userThree.email,
                "password": userThree.password
            }).expect(200)

        userThree.accessToken = response.body.accessToken




    });
    it('CREATE BLOG -> POST-> COMMENT ', async () => {

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

        // CREATE COMMENT 1
        const comment = await request(app)
            .post(`/posts/${post.body.id}/comments`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"content": "bla bla bla test comment"})
            .expect(201)

        // CREATE COMMENT 2
        const comment2 = await request(app)
            .post(`/posts/${post.body.id}/comments`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`)
            .send({"content": "bla bla bla test comment"})
            .expect(201)


        commentId = comment.body.id
        commentId2 = comment2.body.id

    });
    /////////////////////////////    LIKE FLOW    /////////////////////////////////////////
    it('ERROR 400 / 404', async () => {
        // PUSH LIKE | comment id incorrect | SHOULD RETURN 404
        await request(app)
            .put(`/comments/${111}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(404)
        // PUSH LIKE | status incorrect | SHOULD RETURN 401
        const error = await request(app)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Likee"})
            .expect(400)


        expect(error.body).toEqual({
            errorsMessages: [ { message: 'Invalid value', field: 'likeStatus' } ]
        })

    });
    it('PUSH 2 LIKE AND 1 DISLIKE ', async () => {
        // FIRST USER GET COMMENT | SHOULD RETURN O LIKE 0 DISLIKE MY STATUS 'None'
        let comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${userOne.accessToken}`).expect(200)
            expect(comment.body).toEqual({
            id: commentId,
            content: 'bla bla bla test comment',
            createdAt: expect.any(String),

            commentatorInfo: {
                userId: userOne.id,
                userLogin: userOne.login,
            },

            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'
            }
        })

        // FIRST  USER PUT LIKE 2 comment
        await request(app)
            .put(`/comments/${commentId2}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

        comment = await request(app)
            .get(`/comments/${commentId2}`)
            .set('Authorization', `Bearer ${userOne.accessToken}`).expect(200)
            expect(comment.body).toEqual({
                id: commentId2,
                content: 'bla bla bla test comment',
                createdAt: expect.any(String),

                commentatorInfo: {
                    userId: userTwo.id,
                    userLogin: userTwo.login,
                },

                likesInfo: {
                    likesCount: 1,
                    dislikesCount: 0,
                    myStatus: 'Like'
                }
            })

        // FIRST AND SECOND USER PUT DISLIKE, USER THREE PUT LIKE
        await request(app)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Dislike"})
            .expect(204)

        comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${userOne.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentId,
            content: 'bla bla bla test comment',
            createdAt: expect.any(String),

            commentatorInfo: {
                userId: userOne.id,
                userLogin: userOne.login,
            },

            likesInfo: {
                likesCount: 0,
                dislikesCount: 1,
                myStatus: 'Dislike'
            }
        })



        await request(app)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`)
            .send({"likeStatus": "Dislike"})
            .expect(204)

        comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`).expect(200)
            expect(comment.body).toEqual({
                id: commentId,
                content: 'bla bla bla test comment',
                createdAt: expect.any(String),

                commentatorInfo: {
                    userId: userOne.id,
                    userLogin: userOne.login,
                },

                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 2,
                    myStatus: 'Dislike'
                }
            })

        await request(app)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${userThree.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

            comment = await request(app)
                .get(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${userThree.accessToken}`).expect(200)
            expect(comment.body).toEqual({
                id: commentId,
                content: 'bla bla bla test comment',
                createdAt: expect.any(String),

                commentatorInfo: {
                    userId: userOne.id,
                    userLogin: userOne.login,
                },

                likesInfo: {
                    likesCount: 1,
                    dislikesCount: 2,
                    myStatus: 'Like'
                }
            })









    });
    it('GET LIKE STATUS', async () => {

        // FIRST USER GET COMMENT | SHOULD RETURN 1 LIKE 2 DISLIKE AND MY STATUS `Dislike`
        let comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${userOne.accessToken}`).expect(200)
            expect(comment.body).toEqual({
                id: commentId,
                content: 'bla bla bla test comment',
                createdAt: expect.any(String),
                commentatorInfo: {
                    userId: userOne.id,
                    userLogin: userOne.login,
                },
                likesInfo: {
                    likesCount: 1,
                    dislikesCount: 2,
                    myStatus: 'Dislike'
                }
            })

        // SECOND USER GET COMMENT | SHOULD RETURN 1 LIKE 2 DISLIKE AND MY STATUS `Dislike`
        comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`).expect(200)
            expect(comment.body).toEqual({
                id: commentId,
                content: 'bla bla bla test comment',
                createdAt: expect.any(String),
                commentatorInfo: {
                    userId: userOne.id,
                    userLogin: userOne.login,
                },
                likesInfo: {
                    likesCount: 1,
                    dislikesCount: 2,
                    myStatus: 'Dislike'
                }
            })

        // USER THREE GET COMMENT | SHOULD RETURN 1 LIKE 2 DISLIKE AND MY STATUS `Like`
        comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${userThree.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentId,
            content: 'bla bla bla test comment',
            createdAt: expect.any(String),
            commentatorInfo: {
                userId: userOne.id,
                userLogin: userOne.login,
            },
            likesInfo: {
                likesCount: 1,
                dislikesCount: 2,
                myStatus: 'Like'
            }
        })











    });
    it('CHANGE STATUSES', async () => {

        // FIRST USER PUT LIKE | SECOND USER NOT CHANGE | USER THREE REMOVE LIKE
        await request(app)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

        await request(app)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`)
            .send({"likeStatus": "Dislike"})
            .expect(204)

        await request(app)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${userThree.accessToken}`)
            .send({"likeStatus": "None"})
            .expect(204)











    });
    it('GET LIKE STATUS', async () => {

        // FIRST USER GET COMMENT | SHOULD RETURN 1 LIKE 2 DISLIKE AND MY STATUS `Dislike`
        let comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${userOne.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentId,
            content: 'bla bla bla test comment',
            createdAt: expect.any(String),
            commentatorInfo: {
                userId: userOne.id,
                userLogin: userOne.login,
            },
            likesInfo: {
                likesCount: 1,
                dislikesCount: 1,
                myStatus: 'Like'
            }
        })

        // SECOND USER GET COMMENT | SHOULD RETURN 1 LIKE 2 DISLIKE AND MY STATUS `Dislike`
        comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentId,
            content: 'bla bla bla test comment',
            createdAt: expect.any(String),
            commentatorInfo: {
                userId: userOne.id,
                userLogin: userOne.login,
            },
            likesInfo: {
                likesCount: 1,
                dislikesCount: 1,
                myStatus: 'Dislike'
            }
        })

        // USER THREE GET COMMENT | SHOULD RETURN 1 LIKE 2 DISLIKE AND MY STATUS `Like`
        comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${userThree.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentId,
            content: 'bla bla bla test comment',
            createdAt: expect.any(String),
            commentatorInfo: {
                userId: userOne.id,
                userLogin: userOne.login,
            },
            likesInfo: {
                likesCount: 1,
                dislikesCount: 1,
                myStatus: 'None'
            }
        })











    });
    ////////////////////round  2///////////////////////////////
    it('DELETE ALL DATA', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    }, 100000);
    it('CREATE THREE USERS', async () => {

        let response = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(userOne)
            .expect(201)
        userOne.id = response.body.id

        response = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(userTwo)
            .expect(201)
        userTwo.id = response.body.id

        response = await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(userThree)
            .expect(201)
        userThree.id = response.body.id
    });
    it('LOGIN THREE USERS | should return JWT Pair ', async () => {

        /// LOGIN USER
        let response = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": userOne.email,
                "password": userOne.password
            }).expect(200)
        userOne.accessToken = response.body.accessToken

        response = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": userTwo.email,
                "password": userTwo.password
            }).expect(200)

        userTwo.accessToken = response.body.accessToken

        response = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": userThree.email,
                "password": userThree.password
            }).expect(200)

        userThree.accessToken = response.body.accessToken




    });
    it('CREATE BLOG -> POST-> COMMENT ', async () => {

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

        // CREATE POSTS
        const comment = await request(app)
            .post(`/posts/${post.body.id}/comments`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"content": "bla bla bla test comment"})
            .expect(201)

        commentId = comment.body.id

    });
    it('should ', async () => {



        let comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${userOne.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentId,
            content: 'bla bla bla test comment',
            createdAt: expect.any(String),

            commentatorInfo: {
                userId: userOne.id,
                userLogin: userOne.login,
            },

            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'
            }
        })



        // FIRST USER PUT LIKE,
        await request(app)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

        comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${userOne.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentId,
            content: 'bla bla bla test comment',
            createdAt: expect.any(String),

            commentatorInfo: {
                userId: userOne.id,
                userLogin: userOne.login,
            },

            likesInfo: {
                likesCount: 1,
                dislikesCount: 0,
                myStatus: 'Like'
            }
        })






    });
})


