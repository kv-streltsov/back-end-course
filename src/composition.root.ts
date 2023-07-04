import {UsersRepositoryClass} from "./repositories/users-repository";
import {QueryUsersRepositoryClass} from "./repositories/query-users-repository";
import {UsersServiceClass} from "./domain/user-service";
import {UserController} from "./controllers/user.controller";
import {JwtServiceClass} from "./application/jwt-service";


export const jwtService = new JwtServiceClass()

const usersRepository = new UsersRepositoryClass()
const queryUsersRepository = new QueryUsersRepositoryClass()
export const usersService = new UsersServiceClass(usersRepository)
export const userController = new UserController(usersService, queryUsersRepository)


