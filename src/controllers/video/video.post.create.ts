import {InterfaceVideo} from "../../dto/interface.video";
import {video_list} from "../../db/db";

export function videoPostCreate(body:InterfaceVideo){

	let datePub = new Date()
	datePub.setDate(datePub.getDate()+1)

	const createVideo: InterfaceVideo = {
		id: video_list.length + 1,
		title:  body.title,
		author: body.author,
		canBeDownloaded: false,
		minAgeRestriction: null,
		createdAt:       new Date().toISOString(),
		publicationDate: datePub.toISOString(),
		availableResolutions: body.availableResolutions || null
	}
	video_list.push(createVideo)
	return createVideo
}