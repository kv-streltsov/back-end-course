import {InterfaceInputUser, InterfaceViewUser} from "../dto/interface.input.user";
import {collectionUsers} from "../db/db_mongo";


export const usersRepository = {

    postUser: async (createdUser: InterfaceViewUser) => {
        return await collectionUsers.insertOne(createdUser)
    },

    deleteUser: async (id: string) => {
        return await collectionUsers.deleteOne({id: id})
    }

}