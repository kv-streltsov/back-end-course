import {Request, Response, Router} from "express";
import {InterfaceInputUser, InterfaceViewUser} from "../dto/interface.input.user";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {createUserValidation} from "../middleware/validation/user-input-validations";
import {usersService} from "../domain/user-service";
import {HttpStatusCode} from "../dto/interface.html-code";
import {InterfacePaginationQueryParamsUser, InterfacePaginatorUserView, SortType} from "../dto/interface.pagination";
import {queryUsersRepository} from "../repositories/query-users-repository";


export const userRouters = Router({})

userRouters.get('/', basic_auth, async (req: Request<any, any, any, InterfacePaginationQueryParamsUser>, res: Response) => {

    const allUsers = await queryUsersRepository.getAllUsers(
        req.query.pageSize && Number(req.query.pageSize),
        req.query.pageNumber && Number(req.query.pageNumber),
        req.query.sortBy,
        req.query.sortDirection === 'asc' ? SortType.asc : SortType.desc,
        req.query.searchEmailTerm,
        req.query.searchLoginTerm
    )
    res.status(HttpStatusCode.OK).send(allUsers)
})

userRouters.post('/', basic_auth, createUserValidation, async (req: Request<any, any, InterfaceInputUser>, res: Response) => {
    const newUser: InterfaceViewUser = await usersService.postUser(req.body)
    res.status(HttpStatusCode.CREATED).send(newUser)
})
userRouters.delete('/:id', basic_auth, async (req: Request<any, any, InterfaceInputUser>, res: Response) => {

    const deletedUser = await usersService.deleteUser(req.params.id)

    if (deletedUser.deletedCount === 1) {
        res.sendStatus(HttpStatusCode.NO_CONTENT)
    } else {
        res.sendStatus(HttpStatusCode.NOT_FOUND)
    }

})
