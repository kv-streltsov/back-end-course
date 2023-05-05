import {InterfaceVideo, Resolutions} from "../dto/interface.video";
import exp from "constants";
import {InterfaceBlog} from "../dto/interface.blog";

export let video_list: InterfaceVideo[] = [
	{
		id:1,
		title: 'snowboard',
		author: 'kv.streltsov',
		canBeDownloaded: false,
		minAgeRestriction:18,
		createdAt: '2023-04-25T03:39:35.504Z',
		publicationDate:'2023-04-26T03:39:35.504Z',
		availableResolutions: [Resolutions.P1080]
	},
	{
		id:2,
		title: '01 - Back-end Путь Самурая',
		author: 'IT-KAMASUTRA',
		canBeDownloaded: false,
		minAgeRestriction:12,
		createdAt: '2023-04-10T03:39:35.504Z',
		publicationDate:'2023-04-11T03:39:35.504Z',
		availableResolutions: [Resolutions.P720]
	}
]
export let blogs_list:InterfaceBlog[] = [
	{
		id:'1',
		name:'test name',
		description: 'test desc',
		websiteUrl:'http'
	},
	{
		id:'2',
		name:'test name',
		description: 'test desc',
		websiteUrl:'http'
	}
]
export function clear_db():void{
	video_list = []
	blogs_list = []
}