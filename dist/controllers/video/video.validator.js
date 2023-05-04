"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoValidator = void 0;
const interface_video_1 = require("../../dto/interface.video");
function videoValidator(body, method) {
    let errorsMessagesObj = {
        errorsMessages: []
    };
    let checkFlag = false;
    for (const reqElement in body) {
        if (method === 'POST' && !checkFlag) {
            checkFlag = true;
            if (body.title === null || body.title === undefined || typeof body.title !== 'string') {
                errorsMessagesObj.errorsMessages.push({
                    "message": "undefined or not string",
                    "field": "title"
                });
            }
            if (body.author === null || body.author === undefined || typeof body.author !== 'string') {
                errorsMessagesObj.errorsMessages.push({
                    "message": "undefined or not string",
                    "field": "author"
                });
            }
        }
        switch (reqElement) {
            case 'title':
                if (body.title || body.title === null) {
                    if (body.title === null && method === 'PUT') {
                        errorsMessagesObj.errorsMessages.push({
                            "message": "undefined",
                            "field": "title"
                        });
                        break;
                    }
                    if (body.title === null && method === 'POST')
                        break;
                    if (body.title.length > 40) {
                        errorsMessagesObj.errorsMessages.push({
                            "message": "maxLength: 40",
                            "field": "title"
                        });
                    }
                    break;
                }
            case 'author':
                if (body.author || body.author === null) {
                    if (body.author === null && method === 'PUT') {
                        errorsMessagesObj.errorsMessages.push({
                            "message": "undefined",
                            "field": "author"
                        });
                        break;
                    }
                    if (body.author === null && method === 'POST')
                        break;
                    if (body.author.length > 20) {
                        errorsMessagesObj.errorsMessages.push({
                            "message": "maxLength: 20",
                            "field": "author"
                        });
                    }
                }
                break;
            case 'canBeDownloaded':
                if (body.canBeDownloaded || body.canBeDownloaded === false) {
                    if (typeof body.canBeDownloaded !== "boolean") {
                        errorsMessagesObj.errorsMessages.push({
                            "message": "should be boolean",
                            "field": "canBeDownloaded"
                        });
                    }
                }
                break;
            case 'minAgeRestriction':
                if (body.minAgeRestriction || body.minAgeRestriction === 0) {
                    if (typeof body.minAgeRestriction !== "number" || body.minAgeRestriction < 1 || body.minAgeRestriction > 18) {
                        errorsMessagesObj.errorsMessages.push({
                            "message": "should be number and in the range 1-18",
                            "field": "minAgeRestriction"
                        });
                    }
                }
                break;
            case 'publicationDate':
                if (body.publicationDate) {
                    if (typeof body.publicationDate !== "string" || !body.publicationDate.match('\\d{4}(.\\d{2}){2}(\\s|T)(\\d{2}.){2}\\d{2}')) {
                        errorsMessagesObj.errorsMessages.push({
                            "message": "should be date ISO format and string",
                            "field": "publicationDate"
                        });
                    }
                }
                break;
            case 'availableResolutions':
                if (body.availableResolutions) {
                    body.availableResolutions.forEach((resolution) => {
                        if (interface_video_1.Resolutions[resolution] === undefined) {
                            errorsMessagesObj.errorsMessages.push({
                                "message": "Valid values: [ P144, P240, P360, P480, P720, P1080, P1440, P2160 ]",
                                "field": "availableResolutions"
                            });
                        }
                    });
                }
                break;
        }
    }
    if (errorsMessagesObj.errorsMessages.length)
        return errorsMessagesObj;
    return true;
}
exports.videoValidator = videoValidator;
