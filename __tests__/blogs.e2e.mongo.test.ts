import request from 'supertest'
import {app} from "../src";
import {InterfaceBlogInput} from "../src/dto/interface.blog";

const validInputBlog: InterfaceBlogInput = {
    "name":"1",
    "description":"string",
    "websiteUrl":"https://www.youtube.com/watch?v=M87UVXSLu6g&list=PL3iZKbiI2YtfVddy96Gw7V7k20alD2-NJ&index=18&ab_channel=PsychedelicExperience"
}

const unvalidInputBlog = {
    "name": 1,
    "description":"string",
    "websiteUrl":"https://www.youtube.com/watch?v=M87UVXSLu6g&list=PL3iZKbiI2YtfVddy96Gw7V7k20alD2-NJ&index=18&ab_channel=PsychedelicExperience"
}



describe('/blogs', () => {

    it('should return status 401;', async () => {
        await request(app)
            .post('/blogs')
            .auth("admin","qwerty1")
            .send(unvalidInputBlog)
            .expect(401)
    });

    it('should return 204 and remove all data', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    });

    it('should create new video; status 201;', async () => {
        await request(app)
            .post('/blogs')
            .auth("admin","qwerty")
            .send(validInputBlog)
            .expect(201)
    });

    it('should return status 400;', async () => {
        await request(app)
            .post('/blogs')
            .auth("admin","qwerty")
            .send(unvalidInputBlog)
            .expect(400)
    });





})

