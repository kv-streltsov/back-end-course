import request from 'supertest'
import {app} from "../src";
import {InterfaceUserInput} from "../src/dto/interface.user";
import {collectionUsers} from "../src/db/db_mongo";

const user: InterfaceUserInput = {
    login: "megaProger",
    password: "qwerty1",
    email: "clampbeer@google.ru"
}

let createdUser: any

describe('/blogs', () => {




    it('should return 201 and created user', async () => {
        const createdUser = await request(app)
            .post('/auth/registration')
            .send(user)
            .expect(204)

    });

    it('CONFIRM USER ', async () => {
        const projection = { 'confirmation.code': 1, _id: 0 };
        const code = await collectionUsers.findOne({login:user.login}, {projection})
        if(code === null){
            throw new Error('FIND USER ERROR')
        }

        await request(app)
            .post(`/auth/registration-confirmation?code=${code.confirmation.code}`)
            .expect(204)

    });

    it('DELETE USER', async () => {
        const findUser = await collectionUsers.findOne({login:user.login})
        if(findUser===null){
            throw new Error('DELETE USER NOT FOUND')
        }
        await request(app)
            .delete(`/users/${findUser.id}`)
            .auth('admin','qwerty')
            .expect(204)
    });


})




