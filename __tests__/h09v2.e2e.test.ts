import request from 'supertest'
import {app} from "../src";
import {InterfaceUserInput} from "../src/dto/interface.user";
import {collectionDevicesSessions} from "../src/db/db_mongo";
import jwt from "jsonwebtoken";

const user: InterfaceUserInput = {
    "login": "qwerty",
    "password": "qwerty1",
    "email": "kv.streltsov@yandex.ru"
}
let accessToken: any
let refreshToken: any
let userId: any


describe('/09', () => {
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

        const response = await request(app)
            .post('/auth/login')
            .send({
                "loginOrEmail": user.email,
                "password": user.password
            })
            .expect(200)

        const userResponse = await request(app)
            .get('/users')
            .auth('admin', 'qwerty')
            .expect(200)

        expect(userResponse.body.items[0]).toEqual({
            login: user.login,
            email: user.email,
            id: expect.any(String),
            createdAt: expect.any(String)
        })

        expect(userResponse.body.items.length).toBe(1)



        accessToken = response.body.accessToken
        refreshToken = response.headers["set-cookie"]

        const jwtDecode: any = jwt.decode(refreshToken)
        console.log('USER ID:', jwtDecode)

        const devices = await request(app)
            .get('/security/devices')
            .set('Cookie', [refreshToken])
            .expect(200)

        // @ts-ignore
        expect(devices.body[0]).toEqual({
            ip: expect.any(String),
            title: expect.any(String),
            lastActiveDate: expect.any(String),
            deviceId: expect.any(String)
        })
        // @ts-ignore
        expect(devices.body.length).toBe(1)

    });
    it('REFRESH TOKEN | should return JWT Pair      | status 200', async () => {

        const response = await request(app)
            .post('/auth/refresh-token')
            .set('Cookie', [refreshToken])
            .expect(200)

        console.log('acToken: ',response)
        console.log('acToken2: ',response.body.accessToken)

        expect(accessToken !== response.body.accessToken).toBeTruthy()
        expect(refreshToken !== response.headers["set-cookie"]).toBeTruthy()

        console.log('NEW TOKEN: ', response.headers["set-cookie"])


        accessToken = response.body.accessToken
        refreshToken = response.headers["set-cookie"]

    });
    // it('LOGOUT        | should expired refreshToken | status 204', async () => {
    //     const response = await request(app)
    //         .post('/auth/logout')
    //         .set('Cookie', [refreshToken])
    //         .expect(204)
    //
    // });
    // /////////////////////////////    ERROR TOKEN FLOW   //////////////////////////////////////
    // it('LOGIN         | incorrect login      | should return 401', async () => {
    //     await request(app)
    //         .post('/auth/login')
    //         .send({
    //             "loginOrEmail": 'bad_login',
    //             "password": user.password
    //         })
    //         .expect(401)
    // });
    // it('LOGIN         | incorrect password   | should return 401', async () => {
    //     await request(app)
    //         .post('/auth/login')
    //         .send({
    //             "loginOrEmail": user.email,
    //             "password": 'bad_password'
    //         })
    //         .expect(401)
    // }, 100000);
    // it('REFRESH TOKEN | expired refreshToken | should return 401', async () => {
    //     await request(app)
    //         .post('/auth/refresh-token')
    //         .set('Cookie', [refreshToken])
    //         .expect(401)
    // });
    it('REFRESH TOKEN | empty cookies        | should return 401', async () => {
        await request(app)
            .post('/auth/refresh-token')
            .expect(401)
    });
    // it('LOGOUT        | expired refreshToken | should return 401', async () => {
    //     const response = await request(app)
    //         .post('/auth/refresh-token')
    //         .set('Cookie', [refreshToken])
    //         .expect(401)
    //
    // });
    it('LOGOUT        | empty cookies        | should return 401', async () => {
        const response = await request(app)
            .post('/auth/refresh-token')
            .expect(401)
    });
    // ///////////////////////////   DEVICES SESSION FLOW   //////////////////////////////////////

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
                await request(app)
                    .post('/auth/login')
                    .set("User-Agent", 'safari')
                    .send({
                        "loginOrEmail": user.email,
                        "password": user.password
                    }).expect(200)
                resolve(2)
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
                const countDevise = await collectionDevicesSessions.countDocuments()
                expect(countDevise).toBe(5)

                const devisesByUserId = await collectionDevicesSessions.find({userId: userId}).toArray()
                expect(devisesByUserId).toBe(5)

            }
        )
    }, 100000);

    it('should ', async () => {

        await request(app)
            .post('/auth/refresh-token')
            .set('Cookie', [refreshToken])
            .expect(200)

        // expect(response.body.accessToken !== accessToken).toBeTruthy()
        // refreshToken = response.headers["set-cookie"]
        //
        // const devices = await request(app)
        //     .get('/security/devices')
        //     .set('Cookie', [refreshToken])
        //     .expect(200)
        //
        // expect(devices.body.length).toBe(5)
    });


})


