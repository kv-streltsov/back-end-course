import request from 'supertest'
import {app} from "../src";
import {InterfaceUserInput} from "../src/dto/interface.user";
import {collectionUsers} from "../src/db/db_mongo";

const user: InterfaceUserInput = {
	login: "megaProger",
	password: "qwerty1",
	email: "clampbeer@google.ru"
}

let accessToken: any
let refreshToken: any


describe('/08', () => {
	/////////////////////////////    PREPARATION    /////////////////////////////////////////
	it('should delete all data', async () => {
		await request(app)
			.delete('/testing/all-data')
			.expect(204)
	});
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
			.post('/auth/refresh-token')
			.set('Cookie', [refreshToken])
			.expect(200)

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
	});
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
})


