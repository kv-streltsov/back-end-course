import { Router} from "express";
import {authUserValidation} from "../middleware/validation/user-auth-validations";
import {authMiddleware} from "../middleware/jwt-auth-middleware";
import {createUserValidation} from "../middleware/validation/user-input-validations";
import {refreshTokenMiddleware} from "../middleware/refresh-token-middleware";
import {rateLimitMiddleware} from "../middleware/rate-limit-middleware";
import {recoveryPasswordValidator} from "../middleware/validation/password-recovery-validations";
import {authController} from "../composition.root";



export const authRouters = Router({})
////////////////////////////////////  TOKEN FLOW     /////////////////////////////////////////
authRouters.post('/login', rateLimitMiddleware, authUserValidation, authController.login)
authRouters.post('/logout', refreshTokenMiddleware, authController.logout)
authRouters.post('/refresh-token', refreshTokenMiddleware, authController.refreshToken)
/////////////////////////////////    REGISTRATION FLOW    ///////////////////////////////////
authRouters.post('/registration', rateLimitMiddleware, createUserValidation, authController.registration)
authRouters.post('/registration-confirmation', rateLimitMiddleware, authController.registrationConfirmation)
authRouters.post('/registration-email-resending', rateLimitMiddleware, authController.registrationEmailResending)
authRouters.post('/password-recovery', rateLimitMiddleware, authController.passwordRecovery)
authRouters.post('/new-password', rateLimitMiddleware, recoveryPasswordValidator, authController.newPassword)
authRouters.get('/me', authMiddleware, authController.me)
