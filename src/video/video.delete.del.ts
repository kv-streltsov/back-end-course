import {video_list} from "../db/db";

export function videoDeleteDel(id:string):boolean {
	let check_id: boolean = false

	video_list.forEach((value, index) => {
		if(value.id == +id){
			check_id = true
			video_list.splice(index,1)
		}
	})

	return check_id
}


