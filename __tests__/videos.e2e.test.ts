// import supertest from "supertest";
import request from "supertest";
import {app} from "../src";
import {describe} from "node:test";
import {InterfaceVideo, Resolutions} from "../src/dto/interface.video";

describe('/videos',()=>{

	let video = {
		"title": "string",
		"author": "string",
		"availableResolutions": [
			"P144"
		]
	}



	// it('POST should return  201, and new video', async () => {
	// 	await request(app).post('/video/').send(video).expect(201,{
	// 		"id": 3,
	// 		"title": "string",
	// 		"author": "string",
	// 		"canBeDownloaded": true,
	// 		"minAgeRestriction": null,
	// 		"createdAt": "2023-04-25T11:38:02.173Z",
	// 		"publicationDate": "2023-04-25T11:38:02.173Z",
	// 		"availableResolutions": [
	// 			"P144"
	// 		]
	// 	})
	// });


	it('GET should return 200', async () =>{
		await request(app).get('/videos').expect(200)
	});
	it('GET should return 200 and video', async () =>{
		await request(app).get('/videos/3').expect(200,video)
	});
	it('GET should return 404',async () => {
		await request(app).get('/videos/666').expect(404)
	});



})