import {Router} from "express";
import {authUserValidation} from "../middleware/validation/user-auth-validations";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {createUserValidation} from "../middleware/validation/user-input-validations";
import {refreshTokenMiddleware} from "../middleware/refresh-token-middleware";
import {rateLimitMiddleware} from "../middleware/rate-limit-middleware";
import {recoveryPasswordValidator} from "../middleware/validation/password-recovery-validations";
import {container} from "../composition.root";
import {AuthController} from "../controllers/auth.controller";


export const authRouters = Router({})
const authController = container.resolve(AuthController)

////////////////////////////////////  TOKEN FLOW     /////////////////////////////////////////
authRouters.post('/login', rateLimitMiddleware, authUserValidation, authController.login.bind(authController))
authRouters.post('/logout', refreshTokenMiddleware, authController.logout.bind(authController))
authRouters.post('/refresh-token', refreshTokenMiddleware, authController.refreshToken.bind(authController))
/////////////////////////////////    REGISTRATION FLOW    ///////////////////////////////////
authRouters.post('/registration', rateLimitMiddleware, createUserValidation, authController.registration.bind(authController))
authRouters.post('/registration-confirmation', rateLimitMiddleware, authController.registrationConfirmation.bind(authController))
authRouters.post('/registration-email-resending', rateLimitMiddleware, authController.registrationEmailResending.bind(authController))
authRouters.post('/password-recovery', rateLimitMiddleware, authController.passwordRecovery.bind(authController))
authRouters.post('/new-password', rateLimitMiddleware, recoveryPasswordValidator, authController.newPassword.bind(authController))
authRouters.get('/me', authMiddleware, authController.me.bind(authController))
