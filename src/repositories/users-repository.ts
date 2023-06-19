import {InterfaceViewUser} from "../dto/interface.input.user";
import {usersModel} from "../db/schemes/users.scheme";
import {readdirSync} from "fs";

export interface IUpdatePassword {
    salt: string,
    passwordHash: string
}

export const usersRepository = {

    postUser: async (createdUser: InterfaceViewUser) => {
        return await usersModel.create(createdUser)
    },
    checkUser: async (loginOrEmail: string) => {
        return await usersModel.findOne({$or: [{email: loginOrEmail}, {login: loginOrEmail}]})
    },

    updateRecoveryCode: async (email: string, recoveryCode: number) => {
        await usersModel.updateOne({email: email}, {$set: {"confirmation.passwordRecoveryCode": recoveryCode}})
    },
    updateConfirmationCode: async (email: string, uuid: string) => {
        return usersModel.updateOne({email: email}, {$set: {"confirmation.code": uuid}})
    },
    // ИСПРАВИТЬ!!!! НИЖЕ
    updateConfirmationCodee: async (code: string, pyload: any) => {
        return usersModel.updateOne({'confirmation.code': code}, {$set: pyload})
    },
    updatePassword: async (updateData: IUpdatePassword, recoveryCode: string) => {
        return usersModel
            .updateOne(
                {'confirmation.passwordRecoveryCode': recoveryCode},
                {$set: {salt: updateData.salt, password: updateData.passwordHash,'confirmation.passwordRecoveryCode': null}})
    },
    findUserById: async (id: string) => {
        return usersModel.findOne({id: id}).lean()
    },
    findUserByLogin: async (login: string) => {
        return usersModel.findOne({login: login}).lean()
    },
    findUserByEmail: async (email: string) => {
        return usersModel.findOne({email: email}).lean()
    },
    findUserByConfirmationCode: async (code: string) => {
        return usersModel.findOne({'confirmation.code': code}).lean()
    },
    deleteUser: async (id: string) => {
        return usersModel.deleteOne({id: id})
    }

}