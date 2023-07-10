import {UsersServiceClass} from "../domain/user-service";
import {QueryUsersRepositoryClass} from "../repositories/query-users-repository";
import {Request, Response} from "express";
import {InterfacePaginationQueryParamsUser, SortType} from "../dto/interface.pagination";
import {HttpStatusCode} from "../dto/interface.html-code";
import {InterfaceInputUser} from "../dto/interface.input.user";
import {inject, injectable, } from "inversify";


@injectable()
export class UserController {
    constructor(
        @inject(UsersServiceClass) protected usersService: UsersServiceClass,
        @inject(QueryUsersRepositoryClass) protected queryUsersRepository: QueryUsersRepositoryClass
    ) {}

    async getUser(req: Request<any, any, any, InterfacePaginationQueryParamsUser>, res: Response) {
        const allUsers = await this.queryUsersRepository.getAllUsers(
            req.query.pageSize && Number(req.query.pageSize),
            req.query.pageNumber && Number(req.query.pageNumber),
            req.query.sortBy,
            req.query.sortDirection === 'asc' ? SortType.asc : SortType.desc,
            req.query.searchEmailTerm,
            req.query.searchLoginTerm
        )
        res.status(HttpStatusCode.OK).send(allUsers)
    }

    async postUser(req: Request<any, any, InterfaceInputUser>, res: Response) {
        const newUser = await this.usersService.postUser(req.body.login, req.body.email, req.body.password, true)
        res.status(HttpStatusCode.CREATED).send(newUser.createdUser)
    }

    async deleteUser(req: Request<any, any, InterfaceInputUser>, res: Response) {

        const deletedUser = await this.usersService.deleteUser(req.params.id)
        if (deletedUser.deletedCount === 1) {
            res.sendStatus(HttpStatusCode.NO_CONTENT)
        } else {
            res.sendStatus(HttpStatusCode.NOT_FOUND)
        }
    }
}
