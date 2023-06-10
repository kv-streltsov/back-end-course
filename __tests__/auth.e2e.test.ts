import request from 'supertest'
import {app} from "../src";
import {usersRepository} from "../src/repositories/users-repository";
import {collectionUsers} from "../src/db/db_mongo";


describe('/blogs', () => {


    const user = {
        login: "lg-400889",
        password: "qwerty1",
        email: "clampbeer@google.ru"
    }

    it('should wipe all data', async () => {
        const response = await request(app).delete('/testing/all-data')

        expect(response.status).toBe(204)
        const userCount = await collectionUsers.countDocuments()
        expect(userCount).toBe(0)
    });

    it('should return 201 and created user', async () => {
        await request(app)
            .post('/users')
            .auth("admin", "qwerty")
            .send(user)
            .expect(201)

    });

    it('should ', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: user.login,
                password: user.password
            })
            .expect(204)
    });

    it('should ', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: 'incorrect',
                password: user.password
            })
            .expect(401)
    });

    it('should ', async () => {
        await request(app)
            .post('/auth/login')
            .send({
                loginOrEmail: 'блабла',
                password: user.password
            })
            .expect(400)
    });


})




