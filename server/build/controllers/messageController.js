import MessageService from '../services/messageService.js';
export default new class MessageController {
    async addMessage(req, res, next) {
        try {
            const sender_id = req.id;
            const file = req.file;
            const { text, recipient_id } = req.body;
            const { conversation_id } = req.params;
            const messageData = await MessageService.addMessage(file, text, sender_id, recipient_id, conversation_id);
            return res.status(201).json(messageData);
        }
        catch (err) {
            next(err);
        }
    }
    async getMessages(req, res, next) {
        try {
            const { conversation_id } = req.query;
            const messageDate = await MessageService.getMessages(conversation_id);
            return res.json(messageDate);
        }
        catch (err) {
            next(err);
        }
    }
};
//# sourceMappingURL=messageController.js.map