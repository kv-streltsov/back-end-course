import bcrypt from "bcrypt";
import {usersRepository} from "../repositories/users-repository";
import {usersService} from "./user-service";

export const authService = {

    async checkUser(loginOrEmail: string, password: string) {
        return usersService.checkUser(loginOrEmail, password)
    }


}