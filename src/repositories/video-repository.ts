import {InterfaceVideo} from "../dto/interface.video";
import {InterfaceError} from "../dto/Interface-error";
import {blogs_list, video_list} from "../db/db";
import {videoValidator} from "../controllers/video/video.validator";
import {videoPostCreate} from "../controllers/video/video.post.create";
import {videoPutUpdate} from "../controllers/video/video.put.update";

export const videoRepository = {
    getAllVideo(): InterfaceVideo[] {
        return video_list
    },
    findVideoById(id: string): any {

        let findVideo: InterfaceVideo | undefined = video_list.find(video => video.id === +id)

        if (!findVideo) {
            return 404
        } else return findVideo
    },
    postVideo(body: InterfaceVideo, method: string): InterfaceVideo | number | InterfaceError {

        let valid = videoValidator(body, method)
        if (valid.errorsMessages === undefined) return videoPostCreate(body)
        else return valid


    },
    putVideo(id: string, body: InterfaceVideo, method: string) {
        let valid = videoValidator(body, method)

        if (valid === true) {
            let upDateVideo = videoPutUpdate(id, body)
            if (upDateVideo) return 204
            else return 404
        } else return valid

    },
    deleteVideo(id: string): number {

        let findIndexVideo: number = video_list.findIndex(value => value.id === +id)
        if (findIndexVideo === -1) return 404
        blogs_list.splice(findIndexVideo, 1)
        return 204

    }

}