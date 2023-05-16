import exp from "constants";

export interface InterfacePostView {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
}



export interface InterfacePostInput {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export interface InterfacePostInBlog {
    title: string
    shortDescription: string
    content: string
}