import  {Response, Request, Router} from 'express'
import {clear_db} from "../db/db_local";
import {clear_db_mongo} from "../db/db_mongo";

export const testingRouter =  Router({})

testingRouter.delete('/',(req:Request,res: Response)=>{
    clear_db_mongo()
    res.sendStatus(204)
})