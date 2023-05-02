import * as  request from "supertest";
import {app} from "../src";

import {InterfaceVideo, Resolutions} from "../src/dto/interface.video";

describe('/videos', () => {

	it('should ', async () => {
		request(app).get('/videos').expect(200)
	});

})

