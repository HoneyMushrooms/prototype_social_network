import { pool as postgresDB } from '../db/postgresDB.js';
import { join } from 'path'; 
import { IMessage } from './message.interfase.js';

export default new class MessageService {

    async addMessage(sender_id: string, recipient_id: string, conversation_id: number, file?: Express.Multer.File, text?: string) {
    
        let link = '', type = '';
        if(file) {
            link = join('dialogFiles', conversation_id.toString(), file.filename);
            type = (file.mimetype).split('/')[0];
        }

        const { rows: messageData } = await postgresDB.query<IMessage>(`
            INSERT INTO public.message 
                   (conversation_id, sender_id, recipient_id, text, link, type, create_time) 
            VALUES ($1, $2, $3, $4, $5, $6, now()) RETURNING *`, [conversation_id, sender_id, recipient_id, text, link, type]
        );
        
        return messageData;
    }

    async getMessages(conversation_id: number) {
        const { rows: messageDate } = await postgresDB.query<IMessage>(`
            SELECT *
              FROM public.message
             WHERE conversation_id = $1  
            `, [conversation_id]
        );
        
        return messageDate;
    }
}