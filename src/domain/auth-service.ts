import bcrypt from "bcrypt";

export const authService = {
    async createUser(login: string, email: string, password: string) {
        const passwordSalt = await bcrypt.genSalt(10)
        const passwordHash: string = await this._generateHash(password, passwordSalt)
    },
    async _generateHash(password: string, salt: string) {
        const hash:string = await bcrypt.hash(password, salt)
        return hash
    }
}