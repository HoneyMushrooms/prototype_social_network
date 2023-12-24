import MessageService from '../services/messageService.js';
import { Request, Response, NextFunction } from "express";

export default new class MessageController {

    async addMessage(req: Request, res: Response, next: NextFunction) {
        try {
            const sender_id = req.id;
            const file = req.file;
            const { text, recipient_id } = req.body;
            const { conversation_id } = req.params;
            const messageData = await MessageService.addMessage(sender_id, recipient_id, conversation_id, file, text);
            
            return res.status(201).json(messageData);
        } catch(err) {
            next(err);
        }
    }

    async getMessages(req, res, next) {
        try {
            const { conversation_id } = req.query;
            const messageDate = await MessageService.getMessages(conversation_id);

            return res.json(messageDate);
        } catch(err) {
            next(err);
        }
    }
}