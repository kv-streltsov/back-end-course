import request from 'supertest'
import {app} from "../src";
import {InterfaceVideo} from "../src/dto/interface.video";


describe('/testing/all-data', () => {


    it('should return 204 and remove all data', async () => {
        await request(app)
            .delete('/testing/all-data')
            .expect(204)
    });


    it('should create new video; status 201;', async () => {
        await request(app)
            .post('/videos')
            .auth("admin","qwerty")
            .send(
                {
                    "title":"test",
                    "author":"valid author",
                    "availableResolutions":["P144","P240","P720"],
                    "canBeDownloaded":true,
                    "minAgeRestriction":17,
                    "publicationDate":"2023-04-29T10:21:04.993Z"
                })
            .expect(201)
    });




})

