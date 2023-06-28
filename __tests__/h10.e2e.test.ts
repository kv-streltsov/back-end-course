import request from 'supertest'
import {app} from "../src";
import {InterfaceUserInput} from "../src/dto/interface.user";
import jwt from "jsonwebtoken";
import {devicesSessionsModel} from "../src/db/schemes/devices.sessions.scheme";
import {usersModel} from "../src/db/schemes/users.scheme";
import {InterfaceBlogView} from "../src/dto/interface.blog";
import {InterfacePostInput} from "../src/dto/interface.post";
import {QueryLikeStatusRepositoryClass} from "../src/repositories/query-like-status-repository";
import {likesStatusModel} from "../src/db/schemes/likes.scheme";

const user: InterfaceUserInput = {
    "login": "qwerty",
    "password": "qwerty1",
    "email": "kv.streltsov@yandex.ru"
}

let accessToken: any
let refreshToken: any
let refreshToken2: any
let userId: any
let iat: any
let exp: any
let deviseId: any
let passwordRecoveryCode: any

let blogId: any
let postId: any

let commentId: any


describe('/10', () => {
    /////////////////////////////    REPARATION    /////////////////////////////////////////
    it('should delete all data', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    }, 100000);
    it('USERS CREATE | should return 201 and created user', async () => {
        await request(app)
            .post('/users')
            .auth('admin', 'qwerty')
            .send(user)
            .expect(201)
    });
    /////////////////////////////     TOKEN FLOW   //////////////////////////////////////////
    it('LOGIN         | should return JWT Pair      | status 200', async () => {
        /// LOGIN USER
        const response = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": user.email,
                "password": user.password
            }).expect(200)

        /// assign variables access and refresh token for body and cookies
        accessToken = response.body.accessToken
        refreshToken = response.headers["set-cookie"]


        /// GET USERs | SHOULD RETURN One USER
        const userResponse = await request(app)
            .get('/users')
            .auth('admin', 'qwerty')
            .expect(200)

        /// assign variable userId
        userId = userResponse.body.items[0].id

        /// CHECK RETURN BODY
        expect(userResponse.body.items[0]).toEqual({
            login: user.login,
            email: user.email,
            id: expect.any(String),
            createdAt: expect.any(String)
        })
        /// CHECK LENGTH USERS | SHOULD BY 1 user
        expect(userResponse.body.items.length).toBe(1)


        ////// get all devices | should be 1
        const devices = await request(app)
            .get('/security/devices')
            .set('Cookie', [refreshToken])
            .expect(200)

        // @ts-ignore
        ////// check fields device for body and length 1
        expect(devices.body[0]).toEqual({
            ip: expect.any(String),
            title: expect.any(String),
            lastActiveDate: expect.any(String),
            deviceId: expect.any(String)
        })
        // @ts-ignore
        expect(devices.body.length).toBe(1)

    });
    it('REFRESH TOKEN | empty cookies        | should return 401', async () => {
        await request(app)
            .post('/auth/refresh-token')
            .expect(401)
    });
    it('LOGOUT        | empty cookies        | should return 401', async () => {
        const response = await request(app)
            .post('/auth/refresh-token')
            .expect(401)
    });
    /////////////////////////////   DEVICES SESSION FLOW   //////////////////////////////////////
    it('LOGIN         | creates four different device | status 200', async () => {

        await Promise.all([
            new Promise(resolve => setTimeout(async () => {
                await request(app)
                    .post('/auth/login')
                    .set("User-Agent", 'MozZzila')
                    .send({
                        "loginOrEmail": user.email,
                        "password": user.password
                    }).expect(200)
                resolve(1)
            }, 1000)),

            new Promise(resolve => setTimeout(async () => {
                const r = await request(app)
                    .post('/auth/login')
                    .set("User-Agent", 'safari')
                    .send({
                        "loginOrEmail": user.email,
                        "password": user.password
                    }).expect(200)
                resolve(r.headers["set-cookie"])
            }, 2000)), // 2

            new Promise(resolve => setTimeout(async () => {
                await request(app)
                    .post('/auth/login')
                    .set("User-Agent", 'iphoneXr')
                    .send({
                        "loginOrEmail": user.email,
                        "password": user.password
                    }).expect(200)
                resolve(3)
            }, 3000)),

            new Promise(resolve => setTimeout(async () => {
                await request(app)
                    .post('/auth/login')
                    .set("User-Agent", 'googleHome')
                    .send({
                        "loginOrEmail": user.email,
                        "password": user.password
                    }).expect(200)
                resolve(true)
            }, 4000)),

        ]).then(async d => {
                refreshToken2 = d[1]
                const countDevise = await devicesSessionsModel.countDocuments()
                expect(countDevise).toBe(5)

                const devisesByUserId = await devicesSessionsModel.find({userId: userId}).lean()
                expect(devisesByUserId.length).toBe(5)

            }
        )
    }, 100000);
    it('REFRESH TOKEN AND GET ALL DEVISES', async () => {

        /// DECODE OLD REFRESH TOKEN
        const jwtOldDecode: any = jwt.decode(refreshToken[0].slice(13, 272))
        deviseId = jwtOldDecode.deviceId
        userId = jwtOldDecode.userId
        iat = jwtOldDecode.iat
        exp = jwtOldDecode.exp

        const res = await request(app)
            .post('/auth/refresh-token')
            .set('Cookie', refreshToken[0])
            .expect(200)

        expect(accessToken !== res.body.accessToken).toBeTruthy()
        expect(refreshToken !== res.headers["set-cookie"]).toBeTruthy()


        accessToken = res.body.accessToken
        refreshToken = res.headers["set-cookie"]

        /// DECODE NEW REFRESH TOKEN
        const jwtDecode: any = jwt.decode(refreshToken[0].slice(13, 272))

        expect(iat !== jwtDecode.iat).toBeTruthy()
        expect(exp !== jwtDecode.exp).toBeTruthy()
        expect(deviseId === jwtDecode.deviceId).toBeTruthy()

        deviseId = jwtDecode.deviceId
        userId = jwtDecode.userId


        /// FIND ALL DEVISES BY USER ID FOR NEW REFRESH TOKEN
        const devisesByUserId = await devicesSessionsModel.find({userId: userId}).lean()
        expect(devisesByUserId.length).toBe(5)

        /// GET ALL DEVISES BY NEW REFRESH TOKEN
        const resDevises = await request(app)
            .get('/security/devices')
            .set('Cookie', refreshToken)
            .expect(200)

        /// CHECK LENGTH BODY ARRAY AND MODEL
        expect(resDevises.body.length).toBe(5)
        expect(resDevises.body[0]).toEqual({
            title: expect.any(String),
            lastActiveDate: expect.any(String),
            ip: expect.any(String),
            deviceId: expect.any(String)
        })


    });
    it('DELETE ONE DEVISE BY ID  ', async () => {
        /// DELETE DEVISE
        await request(app)
            .delete(`/security/devices/${deviseId}`)
            .set('Cookie', refreshToken[0])
            .expect(204)

        /// SHOULD REJECT DELETED DEVISE
        await request(app)
            .get('/security/devices')
            .set('Cookie', refreshToken[0])
            .expect(401)


        /// FIND ALL DEVISES BY USER ID AFTER REMOVE ONE DEVISE FOR DataBase
        const devisesByUserId = await devicesSessionsModel.find({userId: userId}).lean()
        expect(devisesByUserId.length).toBe(4)

        /// GET ALL DEVISES BY NEW REFRESH TOKEN FOR EndPoint
        const resDevises = await request(app)
            .get('/security/devices')
            .set('Cookie', refreshToken2[0])
            .expect(200)
        expect(resDevises.body.length).toBe(4)


    });
    it('DELETE ALL DEVISE BY ID  EXCEPT FOR CURRENT ', async () => {

        // SHOULD DELETE ALL DEVICE, EXCEPT FOR CURRENT
        await request(app)
            .delete('/security/devices')
            .set('Cookie', refreshToken2[0])

        const resDevise = await request(app)
            .get('/security/devices')
            .set('Cookie', refreshToken2[0])
            .expect(200)
        expect(resDevise.body.length).toBe(1)

    });
    // it('DDOS PROTECT | should return 429', async () => {
    //
    //     await Promise.all([
    //         new Promise(resolve => setTimeout(async () => {
    //             await request(app)
    //                 .post('/auth/login')
    //                 .set("User-Agent", 'DDOS_1')
    //                 .send({
    //                     "loginOrEmail": user.email,
    //                     "password": user.password
    //                 }).expect(200)
    //             resolve(1)
    //         }, 10000)),
    //
    //         new Promise(resolve => setTimeout(async () => {
    //             const r = await request(app)
    //                 .post('/auth/login')
    //                 .set("User-Agent", 'DDOS_2')
    //                 .send({
    //                     "loginOrEmail": user.email,
    //                     "password": user.password
    //                 }).expect(200)
    //             resolve(r.headers["set-cookie"])
    //         }, 10100)), // 2
    //
    //         new Promise(resolve => setTimeout(async () => {
    //             await request(app)
    //                 .post('/auth/login')
    //                 .set("User-Agent", 'DDOS_3')
    //                 .send({
    //                     "loginOrEmail": user.email,
    //                     "password": user.password
    //                 }).expect(200)
    //             resolve(3)
    //         }, 10200)),
    //
    //         new Promise(resolve => setTimeout(async () => {
    //             await request(app)
    //                 .post('/auth/login')
    //                 .set("User-Agent", 'DDOS_4')
    //                 .send({
    //                     "loginOrEmail": user.email,
    //                     "password": user.password
    //                 }).expect(200)
    //             resolve(3)
    //         }, 10300)),
    //         new Promise(resolve => setTimeout(async () => {
    //             await request(app)
    //                 .post('/auth/login')
    //                 .set("User-Agent", 'DDOS_5')
    //                 .send({
    //                     "loginOrEmail": user.email,
    //                     "password": user.password
    //                 }).expect( 200)
    //             resolve(3)
    //         }, 10400)),
    //
    //         new Promise(resolve => setTimeout(async () => {
    //             await request(app)
    //                 .post('/auth/login')
    //                 .set("User-Agent", 'DDOS_6')
    //                 .send({
    //                     "loginOrEmail": user.email,
    //                     "password": user.password
    //                 }).expect(429)
    //             resolve(true)
    //         }, 10500)),
    //
    //     ])
    //
    // }, 100000);
    /////////////////////////////   PASSWORD RECOVERY   //////////////////////////////////////
    it('SEND RECOVERY CODE ', async () => {

        let findUserOld = await usersModel.findOne({email: user.email})
        const oldPasswordRecoveryCode = findUserOld!.confirmation.passwordRecoveryCode

        await request(app)
            .post('/auth/password-recovery')
            .send({"email": user.email}).expect(204)

        await request(app)
            .post('/auth/password-recovery')
            .send({"email": "notexistemail@mail.ru"}).expect(204)

        await request(app)
            .post('/auth/password-recovery')
            .send({"email": "incorrectMail.ru"}).expect(400)

        let findUserNew = await usersModel.findOne({email: user.email})
        const newPasswordRecoveryCode = findUserNew!.confirmation.passwordRecoveryCode

        expect(newPasswordRecoveryCode !== oldPasswordRecoveryCode).toBeTruthy()
        passwordRecoveryCode = newPasswordRecoveryCode

    }, 100000);
    it('SEND NEW PASSWORD AND RECOVERY CODE ', async () => {
        await Promise.all([
            //INCORRECT LENGTH PASSWORD
            new Promise(resolve => setTimeout(async () => {

                await request(app)
                    .post('/auth/login')
                    .set("User-Agent", 'MozZzila')
                    .send({
                        "loginOrEmail": user.email,
                        "password": user.password
                    }).expect(200)
                resolve(1)
            }, 10000)),
            //INCORRECT LENGTH RECOVERY CODE
            new Promise(resolve => setTimeout(async () => {

                await request(app)
                    .post('/auth/new-password')
                    .send(
                        {
                            "newPassword": "newPass",
                            "recoveryCode": '12345'
                        }).expect(400)
                resolve(2)
            }, 11000)),
            //NOT EXIST RECOVERY CODE
            new Promise(resolve => setTimeout(async () => {
                await request(app)
                    .post('/auth/new-password')
                    .send(
                        {
                            "newPassword": "newPass",
                            "recoveryCode": '000000'
                        }).expect(400)
                resolve(3)
            }, 12000)),
            //ALL CORRECT
            new Promise(resolve => setTimeout(async () => {
                await request(app)
                    .post('/auth/new-password')
                    .send(
                        {
                            "newPassword": "newPass",
                            "recoveryCode": passwordRecoveryCode.toString()
                        }).expect(204)
                resolve(4)
            }, 13000)),
            //USED RECOVERY CODE
            new Promise(resolve => setTimeout(async () => {
                await request(app)
                    .post('/auth/new-password')
                    .send(
                        {
                            "newPassword": "newPass",
                            "recoveryCode": passwordRecoveryCode.toString()
                        }).expect(400)
                resolve(5)
            }, 14000)),
        ])
    }, 100000);
    it('LOGIN WITH NEW PASSWORD ', async () => {

        ///LOGIN WITH OLD PASSWORD
        await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": user.email,
                "password": user.password
            }).expect(401)

        ///LOGIN WITH NEW PASSWORD
        await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": user.email,
                "password": "newPass"
            }).expect(200)

    });
    /////////////////////////////        BLOG FLOW         //////////////////////////////////////
    it('BLOG', async () => {


        const firstBlog = {
            "name": "firstBlog",
            "description": "firstBlog description firstBlog description  firstBlog test description",
            "websiteUrl": "https://www.youtube.com/firstBlog"
        }
        const secondBlog = {
            "name": "secondBlog",
            "description": "secondBlog test description secondBlog test description test description",
            "websiteUrl": "https://www.youtube.com/secondBlog"
        }


        // CREATE NEW BLOG
        const newBlog = await request(app)
            .post(`/blogs`)
            .auth('admin', 'qwerty')
            .send(firstBlog)
            .expect(201)

        blogId = newBlog.body.id

        // TO EQUAL NEW BLOG
        expect(newBlog.body).toEqual<InterfaceBlogView>({
            id: expect.any(String),
            createdAt: expect.any(String),
            description: firstBlog.description,
            isMembership: false,
            name: firstBlog.name,
            websiteUrl: firstBlog.websiteUrl,
        })

        //GET BLOG BY ID
        const getBlog = await request(app)
            .get(`/blogs/${newBlog.body.id}`)
            .expect(200)
        // TO EQUAL GOT BLOG
        expect(getBlog.body).toEqual<InterfaceBlogView>({
            id: newBlog.body.id,
            createdAt: newBlog.body.createdAt,
            description: newBlog.body.description,
            isMembership: newBlog.body.isMembership,
            name: newBlog.body.name,
            websiteUrl: newBlog.body.websiteUrl,
        })

        // CREATE SECOND BLOG
        await request(app)
            .post(`/blogs`)
            .auth('admin', 'qwerty')
            .send(secondBlog)
            .expect(201)

        // GET ALL BLOGS
        const getAllBlog = await request(app)
            .get(`/blogs?sortBy=createdAt&pageNumber=1&pageSize=10`)
            .expect(200)
        expect(getAllBlog.body).toEqual({
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [
                {
                    id: expect.any(String),
                    createdAt: expect.any(String),
                    description: secondBlog.description,
                    isMembership: false,
                    name: secondBlog.name,
                    websiteUrl: secondBlog.websiteUrl,
                },
                {
                    id: newBlog.body.id,
                    createdAt: newBlog.body.createdAt,
                    description: newBlog.body.description,
                    isMembership: newBlog.body.isMembership,
                    name: newBlog.body.name,
                    websiteUrl: newBlog.body.websiteUrl,
                },
            ]
        })

        // UPDATE FIRST BLOG
        await request(app)
            .put(`/blogs/${newBlog.body.id}`)
            .auth('admin', 'qwerty')
            .send({
                "name": "updateBlog",
                "description": "description updateBlog",
                "websiteUrl": "https://updateBlog.ru"
            })
            .expect(204)

        const updateBlog = await request(app)
            .get(`/blogs/${newBlog.body.id}`)
            .expect(200)
        // TO EQUAL UPDATE BLOG
        expect(updateBlog.body).toEqual<InterfaceBlogView>({
            id: newBlog.body.id,
            createdAt: newBlog.body.createdAt,
            description: "description updateBlog",
            isMembership: newBlog.body.isMembership,
            name: "updateBlog",
            websiteUrl: "https://updateBlog.ru",
        })

        // DELETE SECOND BLOG
        // await request(app).delete(`/blogs/${}`)


    });
    /////////////////////////////        POST FLOW         //////////////////////////////////////
    it('POST ', async () => {

        const firstPost: InterfacePostInput = {
            title: 'it test first post',
            blogId: blogId,
            content: 'first post content',
            shortDescription: 'shortDescription first post'
        }
        const secondPost: InterfacePostInput = {
            title: 'it test second post',
            blogId: blogId,
            content: 'second post content',
            shortDescription: 'shortDescription second post'
        }

        // CREATE POSTS
        const createdFirstPost = await request(app)
            .post('/posts')
            .auth('admin', 'qwerty')
            .send(firstPost)
            .expect(201)

        expect(createdFirstPost.body).toEqual({
            id: expect.any(String),
            createdAt: expect.any(String),
            blogName: 'updateBlog',
            title: firstPost.title,
            blogId: blogId,
            content: firstPost.content,
            shortDescription: firstPost.shortDescription
        })


        // CREATE POST FOR BLOG
        const secondBlog = await request(app)
            .post(`/blogs/${blogId}/posts`)
            .auth('admin', 'qwerty')
            .send(secondPost)
            .expect(201)

        // GET ALL POSTS
        const allPosts = await request(app)
            .get(`/posts`)
            .expect(200)

        expect(allPosts.body).toEqual(
            {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [
                    {
                        id: expect.any(String),
                        title: 'it test second post',
                        shortDescription: 'shortDescription second post',
                        content: 'second post content',
                        blogId: blogId,
                        blogName: 'updateBlog',
                        createdAt: expect.any(String)
                    },
                    {
                        id: expect.any(String),
                        title: 'it test first post',
                        shortDescription: 'shortDescription first post',
                        content: 'first post content',
                        blogId: blogId,
                        blogName: 'updateBlog',
                        createdAt: expect.any(String)
                    }
                ]
            }
        )

        // UPDATE POST
        await request(app)
            .put(`/posts/${createdFirstPost.body.id}`)
            .auth('admin', 'qwerty')
            .send({
                title: 'update post',
                blogId: blogId,
                content: 'update post content',
                shortDescription: 'shortDescription update post'
            })
            .expect(204)

        // GET POST BY ID
        const updatePost = await request(app)
            .get(`/posts/${createdFirstPost.body.id}`)
            .expect(200)


        expect(updatePost.body).toEqual({
            id: createdFirstPost.body.id,
            title: 'update post',
            shortDescription: 'shortDescription update post',
            content: 'update post content',
            blogId: blogId,
            blogName: 'updateBlog',
            createdAt: expect.any(String)
        })

        // DELETE SECOND POST
        await request(app)
            .delete(`/posts/${secondBlog.body.id}`)
            .auth('admin', 'qwerty')
            .expect(204)


        // GET ALL POSTS AFTER DELETE
        const allPostsAfterDelete = await request(app)
            .get(`/posts`)
            .expect(200)

        expect(allPostsAfterDelete.body).toEqual(
            {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: expect.any(Object)
            }
        )

        postId = createdFirstPost.body.id


    });
    it('COMMENT', async () => {

        const newComment = await request(app)
            .post(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({"content": "bla bla bla first comment"})
            .expect(201)

        const getNewComment = await request(app)
            .get(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)

        expect(getNewComment.body).toEqual(
            {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 1,
                items: [
                    {
                        id: expect.any(String),
                        content: 'bla bla bla first comment',
                        commentatorInfo: expect.any(Object),
                        createdAt: expect.any(String),
                        likesInfo:{
                            likesCount:0,
                            dislikesCount:0,
                            myStatus: 'None'
                        }
                    }
                ]
            }
        )
        expect(getNewComment.body.items[0].commentatorInfo).toEqual({
            "userId": expect.any(String),
            "userLogin": "qwerty"
        })
        commentId = newComment.body.id


    });
    it('LIKE', async () => {

        const queryLikeStatusRepository = new QueryLikeStatusRepositoryClass()

        let likeStatus = await queryLikeStatusRepository.findLikeStatusByUserId(userId)
        let likesCount = await queryLikeStatusRepository.getLikesCount(userId)
        let dislikesCount = await queryLikeStatusRepository.getDislikesCount(userId)

        // GET 0 LIKES
        let comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken}`).expect(200)


        expect(comment.body).toEqual({
            id: commentId,
            content: 'bla bla bla first comment',
            createdAt: expect.any(String),

            commentatorInfo: {
                userId: userId,
                userLogin: user.login,
            },

            likesInfo: {
                likesCount: likesCount,
                dislikesCount: dislikesCount,
                myStatus: 'None'
            }
        })


        // PUSH LIKE
        await request(app)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

        // GET COMMENT WITH ONE LIKE
        comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken}`).expect(200)

        likeStatus = await queryLikeStatusRepository.findLikeStatusByUserId(userId)
        likesCount = await queryLikeStatusRepository.getLikesCount(userId)
        dislikesCount = await queryLikeStatusRepository.getDislikesCount(userId)

        // CHECK ONE LIKE
        expect(comment.body).toEqual({
            id: commentId,
            content: 'bla bla bla first comment',
            createdAt: expect.any(String),

            commentatorInfo: {
                userId: userId,
                userLogin: user.login,
            },

            likesInfo: {
                likesCount: 1,
                dislikesCount: dislikesCount,
                myStatus: likeStatus
            }
        })

        // GET COMMENT WITH ONE LIKE WITHOUT USER
        comment = await request(app)
            .get(`/comments/${commentId}`)

        // CHECK ONE LIKE
        expect(comment.body).toEqual({
            id: commentId,
            content: 'bla bla bla first comment',
            createdAt: expect.any(String),

            commentatorInfo: {
                userId: userId,
                userLogin: user.login,
            },

            likesInfo: {
                likesCount: 1,
                dislikesCount: dislikesCount,
                myStatus: 'None'
            }
        })




        // PUSH 10 LIKE AND 15 DISLIKE
        for(let i = 0;i<10;i++){
            await likesStatusModel.create({
                userId:'testUser',
                commentId: commentId,
                status: 'Like'
            })

        }
        for(let i = 0;i<15;i++){
            await likesStatusModel.create({
                userId:'testUser',
                commentId: commentId,
                status: 'Dislike'
            })
        }

        // GET COMMENT WITH 11 LIKE AND 15 DISLIKE
        comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)

        // CHECK BODY
        expect(comment.body).toEqual({
            id: commentId,
            content: 'bla bla bla first comment',
            createdAt: expect.any(String),

            commentatorInfo: {
                userId: userId,
                userLogin: user.login,
            },

            likesInfo: {
                likesCount: 11,
                dislikesCount: 15,
                myStatus: 'Like'
            }
        })


        // PUSH LIKE | SHOULD BE NO CHANGE
        await request(app)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({"likeStatus": "Like"})
            .expect(204)

        comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)

        // CHECK BODY
        expect(comment.body).toEqual({
            id: commentId,
            content: 'bla bla bla first comment',
            createdAt: expect.any(String),

            commentatorInfo: {
                userId: userId,
                userLogin: user.login,
            },

            likesInfo: {
                likesCount: 11,
                dislikesCount: 15,
                myStatus: 'Like'
            }
        })

        // CHANGE LIKE TO DISLIKE
        await request(app)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({"likeStatus": "Dislike"})
            .expect(204)

        comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)
        // CHECK BODY
        expect(comment.body).toEqual({
            id: commentId,
            content: 'bla bla bla first comment',
            createdAt: expect.any(String),

            commentatorInfo: {
                userId: userId,
                userLogin: user.login,
            },

            likesInfo: {
                likesCount: 10,
                dislikesCount: 16,
                myStatus: 'Dislike'
            }
        })

        // REMOVE LIKEorDISLIKE
        await request(app)
            .put(`/comments/${commentId}/like-status`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({"likeStatus": "None"})
            .expect(204)

        comment = await request(app)
            .get(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .expect(200)

        expect(comment.body).toEqual({
            id: commentId,
            content: 'bla bla bla first comment',
            createdAt: expect.any(String),

            commentatorInfo: {
                userId: userId,
                userLogin: user.login,
            },

            likesInfo: {
                likesCount: 10,
                dislikesCount: 15,
                myStatus: 'None'
            }
        })


        // ADD COMMENT FOR ENDPOINT POST
        comment = await request(app)
            .post(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                "content": "ADD COMMENT FOR ENDPOINT POST"
            })
            .expect(201)


        expect(comment.body).toEqual({
            id: comment.body.id,
            content: "ADD COMMENT FOR ENDPOINT POST",
            createdAt: expect.any(String),
            commentatorInfo: {
                userId: userId,
                userLogin: user.login,
            },

            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: 'None'
            }

        })




        // GET COMMENTS FOR ENDPOINT POST
        comment = await request(app)
            .get(`/posts/${postId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                "content": "ADD COMMENT FOR ENDPOINT POST"
            })
            .expect(200)


        expect(comment.body).toEqual({
            "pagesCount": 1,
            "page": 1,
            "pageSize": 10,
            "totalCount": 2,
            "items": [
                {
                    "id": "1687932707932",
                    "postId": "1687932707724",
                    "content": "ADD COMMENT FOR ENDPOINT POST",
                    "commentatorInfo": {
                        "userId": "012245a6-a973-4b48-ae9f-46ee1404dcb9",
                        "userLogin": "qwerty"
                    },
                    "createdAt": "2023-06-28T06:11:47.932Z",
                    "likesInfo": {
                        "likesCount": 0,
                        "dislikesCount": 0,
                        "myStatus": "None"
                    }
                },
                {
                    "id": "1687932707772",
                    "postId": "1687932707724",
                    "content": "bla bla bla first comment",
                    "commentatorInfo": {
                        "userId": "012245a6-a973-4b48-ae9f-46ee1404dcb9",
                        "userLogin": "qwerty"
                    },
                    "createdAt": "2023-06-28T06:11:47.772Z",
                    "likesInfo": {
                        "likesCount": 0,
                        "dislikesCount": 0,
                        "myStatus": "None"
                    }
                }
            ]
        })










    });

})


