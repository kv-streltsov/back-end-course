import {ILikeStatusInfoView} from "./interface.like";

export interface InterfaceCommentInput {
    content: string
}

export interface ICommentId {
    commentId: string
}

export interface ICommentDb {
    id: string
    postId: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
}


export interface InterfaceCommentView {
    id: string
    postId: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
    likesInfo: ILikeStatusInfoView
}




