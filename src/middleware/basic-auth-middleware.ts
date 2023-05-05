import {Request, Response} from "express";

export const basic_auth = (req: Request, res: Response, next: any) => {
    let header_list: string[] = req.rawHeaders
    //обработать если нет Basic
    header_list.forEach(header => {
        if (header.includes('Basic')) {
            if (header.split(' ')[1] === 'YWRtaW46cXdlcnR5') {
                next()
            } else res.sendStatus(401)
        }
    })
}