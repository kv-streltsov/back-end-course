import {ObjectId} from "mongodb";
import exp from "constants"

export interface InterfaceUserAuthPost {
    loginOrEmail: string
    password: string
}

export interface InterfaceUserInput {
    login: string
    email: string
    password: string
}

export interface IUuid {
    uuid: string
}

export interface IUserId {
    id: string
}
export interface IUserDb {
    _id: ObjectId
    login: string
    confirmation: {
        code: string
        wasConfirm: boolean
        passwordRecoveryCode: number
    }
    email: string
    salt: string
    password: string
    id: string
    createdAt: string
}

export interface ICodeConfirm{
    code:string
}
export interface IEmail{
    email:string
}
export interface INewPasswordRecoveryInput {
    newPassword: string
    recoveryCode: string
}
