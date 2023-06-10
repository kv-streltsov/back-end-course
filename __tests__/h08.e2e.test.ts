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

let testCook:any

describe('/08', () => {

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
	it('LOGIN IN | should return JWT Pair and status 200', async () => {
		const response = await request(app)
			.post('/auth/login')
			.send({
				"loginOrEmail": user.email,
				"password": user.password
			})
			.expect(200)

		accessToken = response.body.accessToken
		refreshToken = response.headers["set-cookie"][0].split(';')[0].slice(13)
		testCook = response.headers["set-cookie"]
	});

	it('REFRESH TOKEN | should return JWT Pair and status 200', async () => {
		const response = await request(app)
			.post('/auth/refresh-token')
			.set('Cookie', [testCook])
			.expect(200)

	});


})


