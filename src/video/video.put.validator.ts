import {Resolutions} from "../dto/interface.video";

export function videoPutValidator(req:any):any{

	let errorsMessagesObj:any = {
		errorsMessages:[]
	}

	//check publicationDate
	if(req.publicationDate){
		if(typeof req.publicationDate !== "string" || !req.publicationDate.match('\\d{4}(.\\d{2}){2}(\\s|T)(\\d{2}.){2}\\d{2}') ){
			errorsMessagesObj.errorsMessages.push({
				"message": "should be date ISO format and string",
				"field": "publicationDate"})
		}
	}

	//check minAgeRestriction
	if(req.minAgeRestriction || req.minAgeRestriction === 0){
		if(typeof req.minAgeRestriction !== "number" || req.minAgeRestriction < 1 || req.minAgeRestriction > 18){
			errorsMessagesObj.errorsMessages.push({
				"message": "should be number and in the range 1-18",
				"field": "minAgeRestriction"})
		}
	}

	//check canBeDownloaded
	if(req.canBeDownloaded){
		if(typeof req.canBeDownloaded !== "boolean") {
			errorsMessagesObj.errorsMessages.push({
			"message": "should be boolean",
			"field": "canBeDownloaded"})
		}
	}

	//check title
	if(req.title || req.title === null){

		if(req.title == null) {errorsMessagesObj.errorsMessages.push({
			"message": "undefined",
			"field": "title"})

		}
		else if(req.title.length > 40) {errorsMessagesObj.errorsMessages.push({
			"message": "maxLength: 40",
			"field": "title"})
		}

	}

	//check author
	if(req.author || req.author === null){
		if(req.author == null) {errorsMessagesObj.errorsMessages.push({
			"message": "undefined",
			"field": "author"})

		}

		else if(req.author.length > 20) {errorsMessagesObj.errorsMessages.push({
			"message": "maxLength: 20",
			"field": "author"})
		}
	}

	//check resolutions
	if(req.availableResolutions){

		req.availableResolutions.forEach(resolution => {
			if(Resolutions[resolution] === undefined){errorsMessagesObj.errorsMessages.push({
				"message": "Valid values: [ P144, P240, P360, P480, P720, P1080, P1440, P2160 ]",
				"field": "availableResolutions"
			})
			}
		})

	}
	//end
	if(errorsMessagesObj.errorsMessages.length) return errorsMessagesObj
	return true
}

