import {NextFunction, Request, Response} from "express";

export const basic_auth = (req: Request, res: Response, next: NextFunction) => {
    let header_list: string[] = req.rawHeaders
    let isAuth = false
    header_list.forEach(header => {
        if (header.includes('Basic')) {
            if (header.split(' ')[1] === 'YWRtaW46cXdlcnR5') {
                isAuth = true
            }
        }
    })
    return isAuth ? next() : res.sendStatus(401)
}

