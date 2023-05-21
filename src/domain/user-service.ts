import {InterfaceInputUser, InterfaceViewUser} from "../dto/interface.input.user";
import {usersRepository} from "../repositories/users-repository";


export const usersService = {
    postUser: async (body: InterfaceInputUser) => {

        const createdUser: InterfaceViewUser = {
            ...body,
            id: new Date().getTime().toString(),
            createdAt: new Date().toISOString()
        }

        await usersRepository.postUser({...createdUser})
        return createdUser
    },

    deleteUser: async (id: string) =>{
        return await usersRepository.deleteUser(id)
    }
}