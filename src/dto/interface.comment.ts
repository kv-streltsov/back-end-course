export interface InterfaceCommentInput {
    content: string
}

export interface ICommentId {
    commendId: string
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
}

export interface ICommentDb {
    _id: any,
    id: string
    postId: string
    content: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
}


