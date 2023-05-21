import {InterfaceViewUser} from "./interface.input.user";

export interface InterfacePaginationQueryParams  {
    pageNumber?: number,
    pageSize?: number,
    sortDirection?: string,
    sortBy?: string,
    searchNameTerm?: string
}

export interface InterfacePaginationQueryParamsUser  {
    pageNumber?: number,
    pageSize?: number,
    sortDirection?: string,
    sortBy?: string,
    searchLoginTerm?: string
    searchEmailTerm?: string
}
export interface InterfacePaginatorUserView{
    pagesCount: number,
    page: number,
    pageSize: number,
    totalCount: number,
    items?: InterfaceViewUser[]

}


export enum SortType {
    asc = 1,
    desc = -1
}