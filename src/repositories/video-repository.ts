import {InterfaceError, InterfaceVideo} from "../dto/interface.video";
import {video_list} from "../db/db";
import {videoValidator} from "../controllers/video/video.validator";
import {videoPostCreate} from "../controllers/video/video.post.create";
import {videoPutUpdate} from "../controllers/video/video.put.update";
import {videoDeleteDel} from "../controllers/video/video.delete.del";
import {type} from "os";

export const videoRepository =  {

    getAllVideo():InterfaceVideo[]{
        return video_list
    },
    findVideoById(id: string):any {

        let findVideo: InterfaceVideo | undefined = video_list.find(video => video.id === +id)

        if(!findVideo){ return 404 }
        else return findVideo
    },
    postVideo (body: InterfaceVideo, method:string):InterfaceVideo | number | InterfaceError{

        let valid = videoValidator(body, method)
        if(valid.errorsMessages === undefined) return videoPostCreate(body)
        else return  valid



    },
    putVideo(id:string,body:InterfaceVideo,method: string){
        let valid = videoValidator(body, method)

        if (valid === true) {
            let upDateVideo = videoPutUpdate(id, body)
            if (upDateVideo) return 204
            else return 404
        }
        else return valid

    },
    deleteVideo(id:string):number {
        let delVideo = videoDeleteDel(id)
        if(delVideo) return 204
        return 404
    }

}