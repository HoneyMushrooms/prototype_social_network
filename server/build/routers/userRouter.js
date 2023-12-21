import { Router } from "express";
import UserController from "../controllers/userController.js";
import { validationUserId } from "../middlewares/validatorMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
const router = new Router();
router.get('/', validationUserId, UserController.getUser);
router.put('/', upload.single('file'), UserController.updateUser);
router.get('/news', UserController.getNews);
router.post('/post', upload.single('file'), UserController.createPost);
router.delete('/post/:id', UserController.deletePost);
router.get('/conversation', UserController.getConversation);
router.patch('/like', UserController.updateLikeCount);
export default router;
//# sourceMappingURL=userRouter.js.map