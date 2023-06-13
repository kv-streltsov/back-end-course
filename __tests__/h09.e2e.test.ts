import request from 'supertest'
import {app} from "../src";
import {InterfaceUserInput} from "../src/dto/interface.user";
import jwt from "jsonwebtoken";

const user: InterfaceUserInput = {
	"login": "qwerty",
	"password": "qwerty1",
	"email": "kv.streltsov@yandex.ru"
}
let testDevises: any[] = []
let accessToken: any
let refreshToken: any


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

		accessToken = response.body.accessToken
		refreshToken = response.headers["set-cookie"]
	});
	it('REFRESH TOKEN | should return JWT Pair      | status 200', async () => {
		const response = await request(app)
			.post('/auth/refresh-token')
			.set('Cookie', [refreshToken])
			.expect(200)

		refreshToken = response.headers["set-cookie"]


	});
	it('LOGOUT        | should expired refreshToken | status 204', async () => {
		const response = await request(app)
			.post('/auth/logout')
			.set('Cookie', [refreshToken])
			.expect(204)

	});
	/////////////////////////////    ERROR TOKEN FLOW   //////////////////////////////////////
	it('LOGIN         | incorrect login      | should return 401', async () => {
		await request(app)
			.post('/auth/login')
			.send({
				"loginOrEmail": 'bad_login',
				"password": user.password
			})
			.expect(401)
	});
	it('LOGIN         | incorrect password   | should return 401', async () => {
		await request(app)
			.post('/auth/login')
			.send({
				"loginOrEmail": user.email,
				"password": 'bad_password'
			})
			.expect(401)
	},100000);
	it('REFRESH TOKEN | expired refreshToken | should return 401', async () => {
		await request(app)
			.post('/auth/refresh-token')
			.set('Cookie', [refreshToken])
			.expect(401)
	});
	it('REFRESH TOKEN | empty cookies        | should return 401', async () => {
		await request(app)
			.post('/auth/refresh-token')
			.expect(401)
	});
	it('LOGOUT        | expired refreshToken | should return 401', async () => {
		const response = await request(app)
			.post('/auth/refresh-token')
			.set('Cookie', [refreshToken])
			.expect(401)

	});
	it('LOGOUT        | empty cookies        | should return 401', async () => {
		const response = await request(app)
			.post('/auth/refresh-token')
			.expect(401)

	});
	///////////////////////////   DEVICES SESSION FLOW   //////////////////////////////////////
	it('LOGIN         | creates four different device | status 200', async () => {
		const asyncArray = [

			await request(app)

				.post('/auth/login')
				.set("User-Agent", 'googleHome')
				.send({
					"loginOrEmail": user.email,
					"password": user.password
				})
				.expect(200),

			await request(app)
				.post('/auth/login')
				.set("User-Agent", 'yandexBroUser')
				.send({
					"loginOrEmail": user.email,
					"password": user.password
				})
				.expect(200),

			await request(app)
				.post('/auth/login')
				.set("User-Agent", 'iphoneXr')
				.send({
					"loginOrEmail": user.email,
					"password": user.password
				})
				.expect(200),

			await request(app)
				.post('/auth/login')
				.set("User-Agent", 'IE')
				.send({
					"loginOrEmail": user.email,
					"password": user.password
				})
				.expect(200)

		]
		await Promise.all(asyncArray).then(async data => {
			for (const req of data) {

				const refreshToken = req.headers["set-cookie"][0].slice(13, 272)
				const tokenDecode: any = await jwt.decode(refreshToken)

				testDevises.push({
					refreshToken: refreshToken,
					iat: tokenDecode.iat,
					userAgent: req.headers["user-agent"]
				})
			}
		})

	}, 100000);
	it('REFRESH TOKEN | refresh token device 1 and request all devices by new token | status 200', async () => {
		const response = await request(app)
			.post('/auth/refresh-token')
			.set("User-Agent", 'googleHome')
			.set('Cookie', `refreshToken=${[testDevises[0].refreshToken]}; Path=/; HttpOnly;`)
			.expect(200)

		testDevises[0].refreshToken = response.headers["set-cookie"][0].slice(13, 272)

		const devices = await request(app)
			.get('/security/devices')
			.set('Cookie', `refreshToken=${[testDevises[0].refreshToken]}; Path=/; HttpOnly;`)
			.expect(200)


	});


})


