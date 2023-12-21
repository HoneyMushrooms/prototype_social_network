import { pool as postgresDB } from '../db/postgresDB.js';
import { join } from 'path';
export default new class MessageService {
    async addMessage(file, text, sender_id, recipient_id, conversation_id) {
        let link = '', type = '';
        if (file) {
            link = join('dialogFiles', conversation_id, file.filename);
            type = (file.mimetype).split('/')[0];
        }
        const { rows: messageData } = await postgresDB.query(`
            INSERT INTO public.message 
                   (conversation_id, sender_id, recipient_id, text, link, type, create_time) 
            VALUES ($1, $2, $3, $4, $5, $6, now()) RETURNING *`, [conversation_id, sender_id, recipient_id, text, link, type]);
        return messageData;
    }
    async getMessages(conversation_id) {
        const { rows: messageDate } = await postgresDB.query(`
            SELECT *
              FROM public.message
             WHERE conversation_id = $1  
            `, [conversation_id]);
        return messageDate;
    }
};
//# sourceMappingURL=messageService.js.map