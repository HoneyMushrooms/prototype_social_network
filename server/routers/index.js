import { Router } from 'express';
import userRouter from './userRouter.js';
import authRouter from './authRouter.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import relationshipRouter from './relationshipRouter.js';
import messageRouter from './messageRouter.js';

const router = new Router();

router.use('/user', authMiddleware, userRouter);
router.use('/auth', authRouter);
router.use('/relationship', authMiddleware, relationshipRouter);
router.use('/message', authMiddleware, messageRouter);

export default router;