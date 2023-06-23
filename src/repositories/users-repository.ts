import {InterfaceViewUser} from "../dto/interface.input.user";
import {usersModel} from "../db/schemes/users.scheme";
import {readdirSync} from "fs";

export interface IUpdatePassword {
    salt: string,
    passwordHash: string
}

class UsersRepositoryClass {
    async postUser(createdUser: InterfaceViewUser) {
        return await usersModel.create(createdUser)
    }

    async checkUser(loginOrEmail: string) {
        return await usersModel.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    }

    async updateRecoveryCode(email: string, recoveryCode: number) {
        await usersModel.updateOne({email: email}, {$set: {"confirmation.passwordRecoveryCode": recoveryCode}})
    }

    async updateConfirmationCode(email: string, uuid: string) {
        return usersModel.updateOne({email: email}, {$set: {"confirmation.code": uuid}})
    }

    // ИСПРАВИТЬ!!!! НИЖЕ
    async updateConfirmationCodee(code: string, pyload: any) {
        return usersModel.updateOne({'confirmation.code': code}, {$set: pyload})
    }

    async updatePassword(updateData: IUpdatePassword, recoveryCode: string) {
        return usersModel
            .updateOne(
                {'confirmation.passwordRecoveryCode': recoveryCode},
                {
                    $set: {
                        salt: updateData.salt,
                        password: updateData.passwordHash,
                        'confirmation.passwordRecoveryCode': null
                    }
                })
    }

    async findUserById(id: string) {
        return usersModel.findOne({id: id}).lean()
    }

    async findUserByLogin(login: string) {
        return usersModel.findOne({login: login}).lean()
    }

    async findUserByEmail(email: string) {
        return usersModel.findOne({email: email}).lean()
    }

    async findUserByConfirmationCode(code: string) {
        return usersModel.findOne({'confirmation.code': code}).lean()
    }

    async deleteUser(id: string) {
        return usersModel.deleteOne({id: id})
    }
}

export const usersRepository = new UsersRepositoryClass()