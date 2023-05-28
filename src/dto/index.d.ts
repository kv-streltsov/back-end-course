//index.d.ts
import {InterfaceUserDb} from "./interface.user";

declare global {
    namespace Express {
        export interface Request {
            user: InterfaceUserDb | null | any
        }
    }
}
