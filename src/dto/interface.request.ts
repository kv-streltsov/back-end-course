// export interface TypedRequestBody<T> extends Express.Request {
//     Query: T
// }

import {Request} from "express";

export interface InterfaceId {
    id: string
}

export interface InterfacePostId {
    postId: string
}

export type RequestWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParamsAndQuery<P, T> = Request<P, {}, {}, T>
export type RequestWithParams<T> = Request<T, {}, {}, {}>
export type RequestWithBody<T> = Request<{}, {}, T, {}>
export type RequestWithParamsAndBody<P, T> = Request<P, {}, T, {}>


export type ResponsePost<T> = Request<T>