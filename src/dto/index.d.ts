//index.d.ts
declare global {
    namespace Express {
        export interface Request {
            user: any | null
        }
    }
}
