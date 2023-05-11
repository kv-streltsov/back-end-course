import  {Response, Request, Router} from 'express'
import {clear_db} from "../db/db_local";

export const testingRouter =  Router({})

testingRouter.delete('/',(req:Request,res: Response)=>{
    clear_db()
    res.sendStatus(204)
})