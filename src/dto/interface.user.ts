import {ObjectId} from "mongodb";

export interface InterfaceUserAuthPost {
    loginOrEmail: string
    password: string
}

export interface InterfaceUserInput {
    login: string
    email: string
    password: string
}


export interface InterfaceUserDb {
    _id: ObjectId
    login: string
    confirmation: {
        code: string
        wasConfirm: boolean
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
