export enum LikeStatus {
    None="None",
    Like="Like",
    Dislike="Dislike"
}

export interface ILike {
    likeStatus: LikeStatus
}
export interface ILikesStatusDb{
    userId: string,
    commentId: string,
    status: LikeStatus
}
export interface ILikeStatusInfoView{
    likesCount: string,
    dislikesCount: string,
    MyStatus: LikeStatus
}