import {Response, Request} from 'express'
import exp from "constants";

export enum Resolutions {
	P144= 'P144',
	P240= 'P240',
	P360= 'P360',
	P480= 'P480',
	P720= 'P720',
	P1080='P1080',
	P1440='P1440',
	P2160='P2160'
}

export interface InterfaceVideo {
	id: number
	title: string
	author: string
	canBeDownloaded?: boolean
	minAgeRestriction?: number | null
	createdAt?: string
	publicationDate?: string
	availableResolutions?: Resolutions[] | null
}

export interface InterfaceError {
	errorsMessages:[{
		message: string,
		field: string
	}]
}

export type RequserWithBody<T> = Request<{},{},T>