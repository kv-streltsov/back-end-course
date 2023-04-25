import {InterfaceVideo, Resolutions} from "../dto/interface.video";

export let video_list: InterfaceVideo[] = [
	{
		id:1,
		title: 'snowboard',
		author: 'kv.streltsov',
		canBeDownloaded: true,
		minAgeRestriction:18,
		createdAt: '2023-04-25T03:39:35.504Z',
		publicationDate:'2023-04-26T03:39:35.504Z',
		availableResolutions: 6
	},
	{
		id:2,
		title: '01 - Back-end Путь Самурая',
		author: 'IT-KAMASUTRA',
		canBeDownloaded: false,
		minAgeRestriction:12,
		createdAt: '2023-04-10T03:39:35.504Z',
		publicationDate:'2023-04-11T03:39:35.504Z',
		availableResolutions: 5
	}
]