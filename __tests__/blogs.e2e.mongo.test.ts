import request from 'supertest'
import {app} from "../src";
import {InterfaceBlogInput} from "../src/dto/interface.blog";

const validInputBlog: InterfaceBlogInput = {
    "name": "1",
    "description": "string",
    "websiteUrl": "https://www.youtube.com/watch?v=M87UVXSLu6g&list=PL3iZKbiI2YtfVddy96Gw7V7k20alD2-NJ&index=18&ab_channel=PsychedelicExperience"
}

const incorrectInputBlog = {
    "name": 1,
    "description": "string",
    "websiteUrl": "https://www.youtube.com/watch?v=M87UVXSLu6g&list=PL3iZKbiI2YtfVddy96Gw7V7k20alD2-NJ&index=18&ab_channel=PsychedelicExperience"
}


describe('/blogs', () => {

    it('should return 204 and remove all data', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    });

    it('POST valid | should create new video; status 201;', async () => {
        const a = await request(app)
            .post('/blogs')
            .auth("admin", "qwerty")
            .send(validInputBlog)
            .expect(201)

        console.log(a.body)
    });

    it('POST incorrect password | should return status 401;', async () => {
        await request(app)
            .post('/blogs')
            .auth("admin", "qwerty1")
            .send(validInputBlog)
            .expect(401)
    });

    it('POST incorrect value | should return status 400;', async () => {
        await request(app)
            .post('/blogs')
            .auth("admin", "qwerty")
            .send(incorrectInputBlog)
            .expect(400)
    });
    // it('GET  should return 200', async () => {
    //     await request(app)
    // });


})

