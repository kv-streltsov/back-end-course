import jwt from 'jsonwebtoken'
import {ObjectId} from "mongodb";
import * as dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
    throw new Error('not found jwt secret')
}

export const jwtService = {
    async createJwt(user: any) {
        return jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: '1h'})
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, JWT_SECRET)
            return result.userId

        } catch (error) {
            return null
        }
    }

}