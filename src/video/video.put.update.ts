import {video_list} from "../db/db";

export function videoPutUpdate(id:string, body:any) {

	video_list.forEach(value => {
		if(value.id = +id){
			console.log(value)

		}
	})

	for (const bodyKey in body) {
		// console.log(bodyKey)

	}
}