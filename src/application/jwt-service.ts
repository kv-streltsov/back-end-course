import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import * as dotenv from 'dotenv'
import {collectionUsers} from "../db/db_mongo";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
    throw new Error('not found jwt secret')
}

export const jwtService = {
    async createJwt(user: any) {
        return  {
            "accessToken": jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '11h'})
        }
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET)
            const checkUser = await collectionUsers.findOne({id: result.userId})
            if (!checkUser) {
                return null
            }

            return result.userId

        } catch (error) {
            return null
        }
    }

}