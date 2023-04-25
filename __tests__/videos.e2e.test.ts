// import supertest from "supertest";
import request from "supertest";
import {app} from "../src";
import {describe} from "node:test";
import {InterfaceVideo, Resolutions} from "../src/dto/interface.video";

describe('/videos',()=>{

	let video:InterfaceVideo ={
		id:1,
		title: 'snowboard',
		author: 'kv.streltsov',
		canBeDownloaded: true,
		minAgeRestriction:18,
		createdAt: '2023-04-25T03:39:35.504Z',
		publicationDate:'2023-04-26T03:39:35.504Z',
		availableResolutions: Resolutions.P1080
	}


	it('GET should return 200', async () =>{
		await request(app).get('/videos').expect(200)
	});
	it('GET should return 200 and video', async () =>{
		await request(app).get('/videos/1').expect(200,video)
	});
	it('GET should return 404',async () => {
		await request(app).get('/videos/666').expect(404)
	});

})