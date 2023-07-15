import {usersModel} from "../db/schemes/users.scheme";
import {injectable} from "inversify";


@injectable()
export class QueryUsersRepositoryClass {
    constructor(private DEFAULT_SORT_FIELD: string = 'createdAt') {
    }

    async getAllUsers(
        pageSize: number = 10,
        pageNumber: number = 1,
        sortBy: string = this.DEFAULT_SORT_FIELD,
        sortDirection: number,
        searchEmailTerm: string | null = null,
        searchLoginTerm: string | null = null
    ) {

        const {
            countItems,
            sortField,
            searchTerm
        } = this.paginationHandler(pageNumber, pageSize, sortBy, sortDirection, searchEmailTerm, searchLoginTerm)

        const count: number = await usersModel.countDocuments(searchTerm)

        const users = await usersModel
            .find(searchTerm)
            .select({_id: 0, password: 0, salt: 0, confirmation: 0, __v: 0})
            .sort(sortField)
            .skip(countItems)
            .limit(pageSize)
            .lean()

        return {
            pagesCount: Math.ceil(count / pageSize),
            page: pageNumber,
            pageSize,
            totalCount: count,
            items: users
        }


    }
    paginationHandler  (pageNumber: number, pageSize: number, sortBy: string, sortDirection: number, searchEmailTerm: string | null, searchLoginTerm: string | null) {

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
}


