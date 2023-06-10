import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
import {collectionExpiredTokens, collectionUsers} from "../db/db_mongo";

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET
const JWT_ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES
const JWT_REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES

if (!JWT_SECRET || !JWT_REFRESH_EXPIRES || !JWT_ACCESS_EXPIRES) {
	throw new Error('not found something jwt env')
}

export const jwtService = {
	async createJwt(user: any) {
		return {
			"accessToken": jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: JWT_ACCESS_EXPIRES}),
			"refreshToken": jwt.sign({userId: user.id}, JWT_SECRET, {expiresIn: JWT_REFRESH_EXPIRES})
		}
	},
	async refreshJwtPair(refreshToken: string) {
		try {
			const result: any = jwt.verify(refreshToken, JWT_SECRET)
			const checkUser = await collectionUsers.findOne({id: result.userId})
			if(!checkUser) return null
			const checkRefreshToken = await collectionExpiredTokens.findOne({expiredToken: refreshToken})
			if (checkRefreshToken) return null
			await collectionExpiredTokens.insertOne({userId: result.userId, expiredToken: refreshToken})
			return this.createJwt(result.userId)

		} catch (error) {
			return null
		}

	},
	async revokeRefreshToken(refreshToken: string) {
		try {
			const result: any = jwt.verify(refreshToken, JWT_SECRET)
			const checkUser = await collectionUsers.findOne({id: result.userId})
			const checkRefreshToken = await collectionExpiredTokens.findOne({expiredToken: refreshToken})
			if (!checkUser || checkRefreshToken){
				return null
			}
			await collectionExpiredTokens.insertOne({userId: result.userId, expiredToken: refreshToken})
			return true

		} catch (error) {
			return null
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