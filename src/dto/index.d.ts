//index.d.ts
import {IUserDb} from "./interface.user";

declare global {
    namespace Express {
        export interface Request {
            user: IUserDb | null | any
        }
    }
}
