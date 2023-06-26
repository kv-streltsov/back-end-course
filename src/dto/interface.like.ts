enum likeStatus {
    None="None",
    Like="Like",
    Dislike="Dislike"
}

export interface ILike {
    likeStatus: likeStatus
}
export interface ILikesStatusDb{
    userId: string,
    commentId: string,
    status: likeStatus
}
export interface ILikeStatusInfoView{
    likesCount: string,
    dislikesCount: string,
    MyStatus: likeStatus
}