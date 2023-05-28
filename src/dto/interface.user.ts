import {ObjectId} from "mongodb";

export interface InterfaceUserAuthPost {
    loginOrEmail: string
    password: string
}

export interface InterfaceUserDb {
    _id: ObjectId
    login: string
    email: string
    salt: string
    password: string
    id: string
    createdAt: string
}

