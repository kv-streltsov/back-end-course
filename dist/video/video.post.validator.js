"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoPostValidator = void 0;
const interface_video_1 = require("../dto/interface.video");
function videoPostValidator(req) {
    let errorsMessagesObj = {
        errorsMessages: []
    };
    //check title
    if (req.title === undefined) {
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
    if (req.author === undefined) {
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
    if (req.availableResolutions) {
        req.availableResolutions.forEach(resolution => {
            if (interface_video_1.Resolutions[resolution] === undefined) {
                errorsMessagesObj.errorsMessages.push({
                    "message": "Valid values: [ P144, P240, P360, P480, P720, P1080, P1440, P2160 ]",
                    "field": "availableResolutions"
                });
            }
        });
    }
    if (errorsMessagesObj.errorsMessages.length)
        return errorsMessagesObj;
    return true;
}
exports.videoPostValidator = videoPostValidator;
