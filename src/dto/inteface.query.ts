import {ParsedUrlQuery} from "querystring";

export type SortDirections = 'asc' | 'desc'


export interface InterfaceQuery {
    searchNameTerm?: string
    sortBy?: string
    sortDirection?: SortDirections
    pageNumber?: string
    pageSize?: string
}


