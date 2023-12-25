import { Router } from "express";
import AuthController from "../controllers/authController.js";
import { validationLoginAndRegister, validationFogotPassword, validationResetPassword } from "../middlewares/validatorMiddleware.js";
import { loginLimit, resetLimit } from "../middlewares/limitMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.get('/activate/:link', AuthController.active);
router.post('/registration', validationLoginAndRegister, AuthController.registration);
router.post('/login', loginLimit, validationLoginAndRegister, AuthController.login);
router.post('/forgot-password', validationFogotPassword, AuthController.forgotPassword);
router.post('/reset-password', resetLimit, validationResetPassword, AuthController.resetPassword);
router.post('/logout', authMiddleware, AuthController.logout);
router.post('/refresh', AuthController.refresh);

export default router;