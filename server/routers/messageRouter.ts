import { Router } from "express";
import upload from "../middlewares/uploadMiddleware.js";
import MessageController from "../controllers/messageController.js";

const router = Router();

router.get('/', MessageController.getMessages);
router.post('/:conversation_id', upload.single('file'), MessageController.addMessage);
            
export default router;