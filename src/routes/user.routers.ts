import {Router} from "express";
import {basic_auth} from "../middleware/basic-auth-middleware";
import {createUserValidation} from "../middleware/validation/user-input-validations";
import {container} from "../composition.root";
import {UserController} from "../controllers/user.controller";

export const userRouters = Router({})
const userController = container.resolve(UserController)

userRouters.get('/', basic_auth, userController.getUser.bind(userController))
userRouters.post('/', basic_auth, createUserValidation, userController.postUser.bind(userController))
userRouters.delete('/:id', basic_auth, userController.deleteUser.bind(userController))