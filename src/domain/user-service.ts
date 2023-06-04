import {usersRepository} from "../repositories/users-repository";
import bcrypt from "bcrypt";
import {collectionUsers} from "../db/db_mongo";
import {randomUUID} from "crypto";

export const usersService = {

    postUser: async (login: string, email: string, password: string) => {
        const salt: string = await bcrypt.genSalt(10)
        const passwordHash: string = await usersService._generateHash(password, salt)

        const uuid = randomUUID()
        const createdUser = {
            login: login,
            email: email,
            confirmation: {
                code: uuid,
                wasConfirm: false
            },
            salt,
            password: passwordHash,
            id: new Date().getTime().toString(),
            createdAt: new Date().toISOString()
        }

        await usersRepository.postUser({...createdUser})

        return ({createdUser:{
                id: createdUser.id,
                login: createdUser.login,
                email: createdUser.email,
                createdAt: createdUser.createdAt

            },uuid})
    },
    confirmationUser: async (code: string)=>{
        const findUser = await collectionUsers.findOne({'confirmation.code': code})
        if(findUser === null){
            return null
        }
        await collectionUsers.updateOne({'confirmation.code': code},{$set: {"confirmation.wasConfirm":true}})
        return true
    },
    getUserById: async (userId: string)=> {
        return await collectionUsers.findOne({id: userId})
    },
    checkUser: async (loginOrEmail: string, password: string) => {
        const user = await usersRepository.checkUser(loginOrEmail)
        if (user === null) {
            return null
        }

        const passwordHash: string = await usersService._generateHash(password, user.salt)

        if (passwordHash !== user.password) {
            return false
        }
        return user
    },
    deleteUser: async (id: string) => {
        return await usersRepository.deleteUser(id)
    },
    _generateHash: async (password: string, salt: string) => {
        return await bcrypt.hash(password, salt)
    }
}