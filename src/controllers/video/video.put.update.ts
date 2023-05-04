import {video_list} from "../../db/db";
import {InterfaceVideo} from "../../dto/interface.video";

export function videoPutUpdate(id: string, body: InterfaceVideo): boolean {
	const videoIndex = video_list.findIndex(v => v.id === +id)
	const video = video_list.find(v => v.id === +id)

	if (videoIndex === -1) {
		return false
	}

	const newVideo = {
		...video,
		...body
	}

	video_list.splice(videoIndex, 1, newVideo)

	return true
}