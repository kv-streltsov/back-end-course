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
    entityId: string,
    status: LikeStatus,
    createdAt: string
}
export interface ILikeStatusInfoView{
    likesCount: string,
    dislikesCount: string,
    MyStatus: LikeStatus
}