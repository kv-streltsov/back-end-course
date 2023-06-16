import {collectionUsers} from "../db/db_mongo";

const DEFAULT_SORT_FIELD = 'createdAt'

export const paginationHandler = (pageNumber: number, pageSize: number, sortBy: string, sortDirection: number, searchEmailTerm: string | null, searchLoginTerm: string | null) => {

    const countItems = (pageNumber - 1) * pageSize;

    let sortField: any = {}
    sortField[sortBy] = sortDirection


    let searchTerm = {}
    if (searchEmailTerm === null && searchLoginTerm === null) {
        searchTerm = {}
    } else if (searchLoginTerm === null && searchEmailTerm !== null) {
        searchTerm = {email: {$regex: searchEmailTerm, $options: 'i'}}
    } else if (searchEmailTerm === null && searchLoginTerm !== null) {
        searchTerm = {login: {$regex: searchLoginTerm, $options: 'i'}}
    } else if (searchEmailTerm !== null && searchLoginTerm !== null) {
        searchTerm = {
            $or: [
                {email: {$regex: searchEmailTerm, $options: 'i'}},
                {login: {$regex: searchLoginTerm, $options: 'i'}}
            ]
        }

    }

    return {
        countItems,
        sortField,
        searchTerm
    }
}
export const queryUsersRepository = {

    getAllUsers: async (
        pageSize: number = 10,
        pageNumber: number = 1,
        sortBy: string = DEFAULT_SORT_FIELD,
        sortDirection: number,
        searchEmailTerm: string | null = null,
        searchLoginTerm: string | null = null
    ) => {

        const {
            countItems,
            sortField,
            searchTerm
        } = paginationHandler(pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm)

        const count: number = await collectionUsers.countDocuments(searchTerm)

        const users = await collectionUsers
            .find(searchTerm, {projection: {_id: 0, password: 0, salt: 0, confirmation:0}})
            .sort(sortField)
            .skip(countItems)
            .limit(pageSize).toArray()

        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: users
        }


    }


}

