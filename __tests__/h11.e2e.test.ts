import request from 'supertest'
import {app} from "../src";
import {likesStatusModel} from "../src/db/schemes/likes.scheme";
import {commentsModel} from "../src/db/schemes/comments.scheme";


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

let commentIdOne: any
let commentIdTwo: any
let commentIdThree: any
let commentIdFour: any
let commentIdFive: any
let commentIdSix: any

let postId: any


describe('/11', () => {
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
                "loginOrEmail": userThree.email,
                "password": userThree.password
            }).expect(200)
        userFour.accessToken = response.body.accessToken


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
        postId = post.body.id

        // CREATE COMMENT 1
        const comment = await request(app)
            .post(`/posts/${post.body.id}/comments`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"content": "bla bla bla test comment"})
            .expect(201)

        // CREATE COMMENT 2
        const commentTwo = await request(app)
            .post(`/posts/${post.body.id}/comments`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`)
            .send({"content": "bla bla bla test comment"})
            .expect(201)


        commentIdOne = comment.body.id
        commentIdTwo = commentTwo.body.id

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
            .put(`/comments/${commentIdOne}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Likee"})
            .expect(400)


        expect(error.body).toEqual({
            errorsMessages: [{message: 'Invalid value', field: 'likeStatus'}]
        })

    });
    it('PUSH 2 LIKE AND 1 DISLIKE ', async () => {
        // FIRST USER GET COMMENT | SHOULD RETURN O LIKE 0 DISLIKE MY STATUS 'None'
        let comment = await request(app)
            .get(`/comments/${commentIdOne}`)
            .set('Authorization', `Bearer ${userOne.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentIdOne,
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
            .put(`/comments/${commentIdTwo}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

        comment = await request(app)
            .get(`/comments/${commentIdTwo}`)
            .set('Authorization', `Bearer ${userOne.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentIdTwo,
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
            .put(`/comments/${commentIdOne}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Dislike"})
            .expect(204)

        comment = await request(app)
            .get(`/comments/${commentIdOne}`)
            .set('Authorization', `Bearer ${userOne.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentIdOne,
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
            .put(`/comments/${commentIdOne}/like-status`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`)
            .send({"likeStatus": "Dislike"})
            .expect(204)

        comment = await request(app)
            .get(`/comments/${commentIdOne}`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentIdOne,
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
            .put(`/comments/${commentIdOne}/like-status`)
            .set('Authorization', `Bearer ${userThree.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

        comment = await request(app)
            .get(`/comments/${commentIdOne}`)
            .set('Authorization', `Bearer ${userThree.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentIdOne,
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
            .get(`/comments/${commentIdOne}`)
            .set('Authorization', `Bearer ${userOne.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentIdOne,
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
            .get(`/comments/${commentIdOne}`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentIdOne,
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
            .get(`/comments/${commentIdOne}`)
            .set('Authorization', `Bearer ${userThree.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentIdOne,
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
            .put(`/comments/${commentIdOne}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

        await request(app)
            .put(`/comments/${commentIdOne}/like-status`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`)
            .send({"likeStatus": "Dislike"})
            .expect(204)

        await request(app)
            .put(`/comments/${commentIdOne}/like-status`)
            .set('Authorization', `Bearer ${userThree.accessToken}`)
            .send({"likeStatus": "None"})
            .expect(204)


    });
    it('GET LIKE STATUS', async () => {

        // FIRST USER GET COMMENT | SHOULD RETURN 1 LIKE 2 DISLIKE AND MY STATUS `Dislike`
        let comment = await request(app)
            .get(`/comments/${commentIdOne}`)
            .set('Authorization', `Bearer ${userOne.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentIdOne,
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
            .get(`/comments/${commentIdOne}`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentIdOne,
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
            .get(`/comments/${commentIdOne}`)
            .set('Authorization', `Bearer ${userThree.accessToken}`).expect(200)
        expect(comment.body).toEqual({
            id: commentIdOne,
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
    it('DROP ALL LIKES AND COMMENTS THEN CREATE 6 COMMENTS', async () => {

        // DROP ALL LIKES AND COMMENTS
        await likesStatusModel.deleteMany({})
        await commentsModel.deleteMany({})

        // CREATE 6 COMMENTS

        let comment = await request(app)
            .post(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"content": "bla bla bla test comment One"})
            .expect(201)
        commentIdOne = comment.body.id

        comment = await request(app)
            .post(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"content": "bla bla bla test comment Two"})
            .expect(201)
        commentIdTwo = comment.body.id

        comment = await request(app)
            .post(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"content": "bla bla bla test comment Three"})
            .expect(201)
        commentIdThree = comment.body.id

        comment = await request(app)
            .post(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"content": "bla bla bla test comment Four"})
            .expect(201)
        commentIdFour = comment.body.id

        comment = await request(app)
            .post(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"content": "bla bla bla test comment Five"})
            .expect(201)
        commentIdFive = comment.body.id

        comment = await request(app)
            .post(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"content": "bla bla bla test comment Six"})
            .expect(201)
        commentIdSix = comment.body.id


    });
    it('LIKE/DISLIKE COMMENT ', async () => {


        //like comment 1 by user 1, user 2
        await request(app)
            .put(`/comments/${commentIdOne}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)
        await request(app)
            .put(`/comments/${commentIdOne}/like-status`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

        //like comment 2 by user 2, user 3;
        await request(app)
            .put(`/comments/${commentIdTwo}/like-status`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)
        await request(app)
            .put(`/comments/${commentIdTwo}/like-status`)
            .set('Authorization', `Bearer ${userThree.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

        //dislike comment 3 by user 1
        await request(app)
            .put(`/comments/${commentIdThree}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Dislike"})
            .expect(204)

        //like comment 4 by user 1, user 4, user 2, user 3;
        await request(app)
            .put(`/comments/${commentIdFour}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)
        await request(app)
            .put(`/comments/${commentIdFour}/like-status`)
            .set('Authorization', `Bearer ${userFour.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)
        await request(app)
            .put(`/comments/${commentIdFour}/like-status`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)
        await request(app)
            .put(`/comments/${commentIdFour}/like-status`)
            .set('Authorization', `Bearer ${userThree.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)


        // like comment 5 by user 2, dislike by user 3;
        await request(app)
            .put(`/comments/${commentIdFive}/like-status`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)
        await request(app)
            .put(`/comments/${commentIdFive}/like-status`)
            .set('Authorization', `Bearer ${userThree.accessToken}`)
            .send({"likeStatus": "Dislike"})
            .expect(204)

        //  like comment 6 by user 1, dislike by user 2.
        await request(app)
            .put(`/comments/${commentIdSix}/like-status`)
            .set('Authorization', `Bearer ${userOne.accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)
        await request(app)
            .put(`/comments/${commentIdSix}/like-status`)
            .set('Authorization', `Bearer ${userTwo.accessToken}`)
            .send({"likeStatus": "Dislike"})
            .expect(204)


    });
    it('GET ALL COMMENTS', async () => {

        //Get the comments by user 1 after all likes
        //   status 200; content: comments array for post with pagination;

        let comments = await request(app)
            .get(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${userOne.accessToken}`).expect(200)

        expect(comments.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 6,
            items: [
                {
                    id: commentIdOne,
                    content: 'bla bla bla test comment One',
                    commentatorInfo: {
                        userId: userOne.id,
                        userLogin: userOne.login,
                    },
                    createdAt: expect.any(String),
                    likesInfo: {
                        likesCount: 1,
                        dislikesCount: 1,
                        myStatus: 'Like'
                    }
                },
                {
                    id: commentIdTwo,
                    content: 'bla bla bla test comment Two',
                    commentatorInfo: {
                        userId: userOne.id,
                        userLogin: userOne.login,
                    },
                    createdAt: expect.any(String),
                    likesInfo: {
                        likesCount: 1,
                        dislikesCount: 1,
                        myStatus: 'Like'
                    }
                },
                {
                    id: commentIdThree,
                    content: 'bla bla bla test comment Three',
                    commentatorInfo: {
                        userId: userOne.id,
                        userLogin: userOne.login,
                    },
                    createdAt: expect.any(String),
                    likesInfo: {
                        likesCount: 1,
                        dislikesCount: 1,
                        myStatus: 'Like'
                    }
                },
                {
                    id: commentIdFour,
                    content: 'bla bla bla test comment Four',
                    commentatorInfo: {
                        userId: userOne.id,
                        userLogin: userOne.login,
                    },
                    createdAt: expect.any(String),
                    likesInfo: {
                        likesCount: 1,
                        dislikesCount: 1,
                        myStatus: 'Like'
                    }
                },
                {
                    id: commentIdFive,
                    content: 'bla bla bla test comment Five',
                    commentatorInfo: {
                        userId: userOne.id,
                        userLogin: userOne.login,
                    },
                    createdAt: expect.any(String),
                    likesInfo: {
                        likesCount: 1,
                        dislikesCount: 1,
                        myStatus: 'Like'
                    }
                },
                {
                    id: commentIdSix,
                    content: 'bla bla bla test comment Six',
                    commentatorInfo: {
                        userId: userOne.id,
                        userLogin: userOne.login,
                    },
                    createdAt: expect.any(String),
                    likesInfo: {
                        likesCount: 1,
                        dislikesCount: 1,
                        myStatus: 'Like'
                    }
                }
            ]
        }
        )



    });
})


