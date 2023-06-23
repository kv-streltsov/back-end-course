import {UsersRepositoryClass} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {randomUUID} from "crypto";
import {IResultUserService} from "../dto/interface.user.service.contract";


export class UsersServiceClass {

    private usersRepository: UsersRepositoryClass
    constructor() {
        this.usersRepository = new UsersRepositoryClass()
    }

    async postUser(login: string, email: string, password: string, confirmAdmin: boolean = false) {
        const salt: string = await bcrypt.genSalt(10)
        const passwordHash: string = await this._generateHash(password, salt)

        const uuid = randomUUID() //
        const createdUser = {
            login: login,
            email: email,
            confirmation: {
                code: uuid,
                wasConfirm: confirmAdmin
            },
            salt,
            password: passwordHash,
            id: randomUUID(),
            createdAt: new Date().toISOString()
        }

        await this.usersRepository.postUser({...createdUser})

        return ({
            createdUser: {
                id: createdUser.id,
                login: createdUser.login,
                email: createdUser.email,
                createdAt: createdUser.createdAt

            }, uuid
        })
    }

    async  confirmationUser  (code: string): Promise<IResultUserService<boolean>>  {
        const findUser = await this.usersRepository.findUserByConfirmationCode(code)
        if (findUser === null || findUser.confirmation.wasConfirm === true) {
            return {
                data: null,
                "errorsMessages": [
                    {
                        "message": "confirm code error",
                        "field": "code"
                    }
                ],
                isSuccess: false
            }
        }
        await this.usersRepository.updateConfirmationCode(code, {
            "confirmation.wasConfirm": true,
            "confirmation.code": null
        })
        return {data: true, errorsMessages: null, isSuccess: true}
    }

    async reassignConfirmationCode(email: string): Promise<IResultUserService<string>> {
        const findUser = await this.usersRepository.findUserByEmail(email)
        if (findUser === null || findUser.confirmation.wasConfirm === true) {
            return {
                isSuccess: false,
                errorsMessages: [
                    {
                        message: "email already exist or confirmed",
                        field: "email"
                    }
                ],
                data: null
            }
        }

        const uuid: string = randomUUID()
        await this.usersRepository.updateConfirmationCodeByEmail(email, uuid)
        return {
            data: uuid,
            isSuccess: true,
            errorsMessages: null
        }

    }

    async getUserById(userId: string) {
        return await this.usersRepository.findUserById(userId)
    }

    async recoveryPassword(password: string, recoveryCode: string) {
        const updatePassword = await this._generatePasswordHash(password)
        const result = await this.usersRepository.updatePassword(updatePassword, recoveryCode)
        return result.modifiedCount
    }

    async checkUser(loginOrEmail: string, password: string) {
        const user = await this.usersRepository.checkUser(loginOrEmail)
        if (user === null) {
            return null
        }

        const passwordHash: string = await this._generateHash(password, user.salt)

        if (passwordHash !== user.password) {
            return false
        }
        return user
    }

    async deleteUser(id: string) {
        return await this.usersRepository.deleteUser(id)
    }

    async _generatePasswordHash(password: string) {
        const salt: string = await bcrypt.genSalt(10)
        const passwordHash: string = await this._generateHash(password, salt)
        return {salt, passwordHash}
    }

    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    }
}

export const usersService = new UsersServiceClass()

