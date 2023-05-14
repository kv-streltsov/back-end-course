import request from 'supertest'
import {app} from "../src";
import {InterfaceBlogInput} from "../src/dto/interface.blog";
import {InterfacePostInput} from "../src/dto/interface.post";

const validInputPost: InterfacePostInput = {
    title: "string",
    blogId: "string",
    content: "string",
    shortDescription: "string"
}
const incorrectInputPost = {
    title: 1,
    blogId: 1,
    content: 1,
    shortDescription: 1
}


let postId: string
let postBody: object

describe('/blogs', () => {
    it('should return 204 and remove all data', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    });
    it('POST valid | should create new video; status 201;', async () => {
        const requestTest = await request(app)
            .post('/blogs')
            .auth("admin", "qwerty")
            .send({
                "name": "1",
                "description": "string",
                "websiteUrl": "https://www.youtube.com/watch?v=M87UVXSLu6g&list=PL3iZKbiI2YtfVddy96Gw7V7k20alD2-NJ&index=18&ab_channel=PsychedelicExperience"
            })
            .expect(201)
        validInputPost.blogId = requestTest.body.id

        postBody = requestTest.body
    });

///////////////////////////////////////////POST/////////////////////////////////////////////////////////////////////////
    it('POST valid | should create new video; status 201;', async () => {
        const requestTest = await request(app)
            .post('/posts')
            .auth("admin", "qwerty")
            .send(validInputPost)
            .expect(201)

        postId = requestTest.body.id
        postBody = requestTest.body
    });
    it('POST incorrect password | should return status 401;', async () => {
        await request(app)
            .post('/posts')
            .auth("admin", "qwerty1")
            .send(validInputPost)
            .expect(401)
    });
    it('POST incorrect value | should return status 400;', async () => {
        await request(app)
            .post('/posts')
            .auth("admin", "qwerty")
            .send(incorrectInputPost)
            .expect(400, {
                errorsMessages: [
                    {message: 'Invalid value', field: 'title'},
                    {message: 'Invalid value', field: 'shortDescription'},
                    {message: 'Invalid value', field: 'content'},
                    {message: 'Invalid value', field: 'blogId'}
                ]
            })
    });

/////////////////////////////////////////////GET/////////////////////////////////////////////////////////////////////////
    it('GET valid | should return [] status 200 ', async () => {
        await request(app).get('/posts').expect(200, [postBody])
    });
    it('GET valid | should return blog by ID status 200', async () => {

        await request(app)
            .get(`/posts/${postId}`)
            .expect(200, postBody)
    });
    it('GET incorrect ID | should return status 404', async () => {

        await request(app)
            .get(`/posts/9999999999`)
            .expect(404)
    });

/////////////////////////////////////////////PUT////////////////////////////////////////////////////////////////////////
    it('PUT valid | should return status 204;', async () => {
        await request(app)
            .put(`/posts/${postId}`)
            .auth("admin", "qwerty")
            .send(validInputPost)
            .expect(204)
    });
    it('PUT incorrect ID | should return status 404;', async () => {
        await request(app)
            .put(`/posts/99999999999999`)
            .auth("admin", "qwerty")
            .send(validInputPost)
            .expect(404)
    });
    it('PUT incorrect value | should return status 400;', async () => {
        await request(app)
            .put(`/posts/${postId}`)
            .auth("admin", "qwerty")
            .send(incorrectInputPost)
            .expect(400, {
                errorsMessages: [
                    { message: 'Invalid value', field: 'title' },
                    { message: 'Invalid value', field: 'shortDescription' },
                    { message: 'Invalid value', field: 'content' },
                    { message: 'Invalid value', field: 'blogId' }
                ]
            })
    });
    it('PUT incorrect password | should return status 401;', async () => {
        await request(app)
            .put(`/posts/${postId}`)
            .auth("admin", "qwerty1")
            .send(validInputPost)
            .expect(401)
    })

/////////////////////////////////////////////DELETE/////////////////////////////////////////////////////////////////////
    it('DELETE valid | should return 204', async () => {
        await request(app)
            .delete(`/posts/${postId}`)
            .auth("admin", "qwerty")
            .expect(204)
    });
    it('DELETE incorrect password | should return 401', async () => {
        await request(app)
            .delete(`/posts/${postId}`)
            .auth("admin", "qwerty1")
            .expect(401)
    });
    it('DELETE incorrect ID | should return 404', async () => {
        await request(app)
            .delete(`/posts/9999999999`)
            .auth("admin", "qwerty")
            .expect(404)
    });

})




