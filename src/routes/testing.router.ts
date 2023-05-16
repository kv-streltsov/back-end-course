import {Response, Request, Router} from 'express'
import {clear_db_mongo} from "../db/db_mongo";
import {HttpStatusCode} from "../dto/interface.html-code";

export const testingRouter = Router({})

testingRouter.delete('/', (req: Request, res: Response) => {
    const result = clear_db_mongo()
    result.then(data => {
        if (data) {
            res.sendStatus(HttpStatusCode.NO_CONTENT)
        }
    })

})