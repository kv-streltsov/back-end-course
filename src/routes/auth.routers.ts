import {Request, Response, Router} from "express";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {authService} from "../domain/auth-service";
import {HttpStatusCode} from "../dto/interface.html-code";


export const authRouters = Router({})


authRouters.post('/login', basic_auth,  async (req: Request, res: Response) => {
    const userAuth = await authService.checkUser(req.body.loginOrEmail, req.body.password)
    console.log(userAuth)
    if (userAuth){
        res.sendStatus(HttpStatusCode.NO_CONTENT)
    }
    if(userAuth === null){
        res.sendStatus(HttpStatusCode.NOT_FOUND)
    }
    res.sendStatus(HttpStatusCode.UNAUTHORIZED)
})



