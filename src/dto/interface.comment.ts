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

