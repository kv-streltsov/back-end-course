import request from 'supertest'
import {app} from "../src";
import {InterfaceUserInput} from "../src/dto/interface.user";
import jwt from "jsonwebtoken";
import {devicesSessionsModel} from "../src/db/schemes/devices.sessions.scheme";
import {usersModel} from "../src/db/schemes/users.scheme";

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

})


