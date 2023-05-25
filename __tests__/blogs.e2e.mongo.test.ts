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
    "description": 2,
    "websiteUrl": 123
}


let blogId: string
let blogBody: object

describe('/blogs', () => {

    it('should return 204 and remove all data', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    });

///////////////////////////////////////////POST//////////////////////////////////////////////////////////////////////////
    it('POST valid | should create new video; status 201;', async () => {
        const requestTest = await request(app)
            .post('/blogs')
            .auth("admin", "qwerty")
            .send(validInputBlog)
            .expect(201)
        blogId = requestTest.body.id
        blogBody = requestTest.body
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
            .expect(400, {
                errorsMessages: [
                    {message: 'Invalid value', field: 'name'},
                    {message: 'Invalid value', field: 'description'},
                    {message: 'Invalid value', field: 'websiteUrl'}
                ]
            })
    });

///////////////////////////////////////////GET//////////////////////////////////////////////////////////////////////////
    it('GET valid | should return [] status 200 ', async () => {
        await request(app).get('/blogs').expect(200)
    });
    it('GET valid | should return blog by ID status 200', async () => {

        await request(app)
            .get(`/blogs/${blogId}`)
            .expect(200, blogBody)
    });
    it('GET incorrect ID | should return status 404', async () => {

        await request(app)
            .get(`/blogs/9999999999`)
            .expect(404)
    });

///////////////////////////////////////////PUT//////////////////////////////////////////////////////////////////////////    
    it('PUT valid | should return status 204;', async () => {
        await request(app)
            .put(`/blogs/${blogId}`)
            .auth("admin", "qwerty")
            .send(validInputBlog)
            .expect(204)
    });
    it('PUT incorrect ID | should return status 404;', async () => {
        await request(app)
            .put(`/blogs/99999999999999`)
            .auth("admin", "qwerty")
            .send(validInputBlog)
            .expect(404)
    });
    it('PUT incorrect value | should return status 400;', async () => {
        await request(app)
            .put(`/blogs/${blogId}`)
            .auth("admin", "qwerty")
            .send(incorrectInputBlog)
            .expect(400,{
                errorsMessages: [
                    {message: 'Invalid value', field: 'name'},
                    {message: 'Invalid value', field: 'description'},
                    {message: 'Invalid value', field: 'websiteUrl'}
                ]
            })
    });
    it('PUT incorrect password | should return status 401;', async () => {
        await request(app)
            .put(`/blogs/${blogId}`)
            .auth("admin", "qwerty1")
            .send(validInputBlog)
            .expect(401)
    })

///////////////////////////////////////////DELETE///////////////////////////////////////////////////////////////////////
    it('DELETE valid | should return 204', async () => {
        await request(app)
            .delete(`/blogs/${blogId}`)
            .auth("admin", "qwerty")
            .expect(204)
    });
    it('DELETE incorrect password | should return 401', async () => {
        await request(app)
            .delete(`/blogs/${blogId}`)
            .auth("admin", "qwerty1")
            .expect(401)
    });
    it('DELETE incorrect ID | should return 404', async () => {
        await request(app)
            .delete(`/blogs/9999999999`)
            .auth("admin", "qwerty")
            .expect(404)
    });

})




