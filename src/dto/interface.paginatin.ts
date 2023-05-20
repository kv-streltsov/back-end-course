export interface InterfacePaginationQueryParams  {
    pageNumber?: number,
    pageSize?: number,
    sortDirection?: string,
    sortBy?: string,
    searchNameTerm?: string

}

export enum SortType {
    ask = -1,
    desc = 1
}
