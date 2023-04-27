"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoPostValidator = void 0;
function videoPostValidator(req) {
    let errorsMessagesObj = {
        errorsMessages: []
    };
    //check canBeDownloaded
    if (req.canBeDownloaded) {
        if (typeof req.canBeDownloaded !== "boolean") {
            errorsMessagesObj.errorsMessages.push({
                "message": "should be boolean",
                "field": "canBeDownloaded"
            });
        }
    }
    //check title
    if (!req.title) {
        errorsMessagesObj.errorsMessages.push({
            "message": "undefined",
            "field": "title"
        });
    }
    else if (req.title.length > 40) {
        errorsMessagesObj.errorsMessages.push({
            "message": "maxLength: 40",
            "field": "title"
        });
    }
    //check author
    if (!req.author) {
        errorsMessagesObj.errorsMessages.push({
            "message": "undefined",
            "field": "author"
        });
    }
    else if (req.author.length > 20) {
        errorsMessagesObj.errorsMessages.push({
            "message": "maxLength: 20",
            "field": "author"
        });
    }
    //check resolutions
    if (errorsMessagesObj.errorsMessages.length)
        return errorsMessagesObj;
    return true;
}
exports.videoPostValidator = videoPostValidator;
