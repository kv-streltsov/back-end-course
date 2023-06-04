import {WithId} from "mongodb";

export interface InterfaceBlog {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}

export interface InterfaceBlogInput {
    name: string        //maxLength: 15
    description: string //maxLength: 500
    websiteUrl: string  //maxLength: 500 URL
}

export interface InterfaceBlogView {
    id: string
    name: string
    description: string
    websiteUrl: string
    createdAt: string
    isMembership: boolean // default false
}

export interface InterfaceGetBlogsWitchQuery {
    pagesCount?: number
    page?: number
    pageSize?: number
    totalCount?: number
    items?:WithId<any>[]
}


