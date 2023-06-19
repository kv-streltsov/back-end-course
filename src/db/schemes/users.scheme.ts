import mongoose, {Schema} from "mongoose";
import {IUserDb} from "../../dto/interface.user";

const UsersScheme = new Schema<IUserDb>({
    id: String,
    login: String,
    email: String,
    confirmation: {
        code: String,
        wasConfirm: String,
        passwordRecoveryCode: Number
    },
    salt: String,
    password: String,
    createdAt: String

})

export const usersModel = mongoose.model('Users', UsersScheme, 'Users')