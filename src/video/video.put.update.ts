import {video_list} from "../db/db";

export function videoPutUpdate(id:string, body:any):boolean {
	let check_id: boolean = false
	for (const video of video_list) {
		if(video.id === +id){
			check_id = true
			for (const bodyElement in body) { video[bodyElement] = body[bodyElement] }
		}
	}
	return check_id
}