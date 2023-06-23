import {Request, Response, Router} from "express";
import {InterfaceInputUser, InterfaceViewUser} from "../dto/interface.input.user";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {createUserValidation} from "../middleware/validation/user-input-validations";
import {HttpStatusCode} from "../dto/interface.html-code";
import {InterfacePaginationQueryParamsUser, SortType} from "../dto/interface.pagination";
import {QueryUsersRepositoryClass} from "../repositories/query-users-repository";
import {UsersServiceClass} from "../domain/user-service";


export const userRouters = Router({})

class UserController {

    private usersService: UsersServiceClass
    private queryUsersRepository: QueryUsersRepositoryClass

    constructor() {
        this.usersService = new UsersServiceClass()
        this.queryUsersRepository = new QueryUsersRepositoryClass()
    }

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


const userController = new UserController()

userRouters.get('/', basic_auth, userController.getUser.bind(userController))
userRouters.post('/', basic_auth, createUserValidation, userController.postUser.bind(userController))
userRouters.delete('/:id', basic_auth, userController.deleteUser.bind(userController))