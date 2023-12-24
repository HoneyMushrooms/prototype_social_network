interface IMessage {
    id: number;
    conversation_id: number;
    sender_id: string;
    recipient_id: string;
    text: string | null; 
    link?: string | null;
    type?: string | null;
    is_new: boolean; 
    create_time: string; 
}
  
export { IMessage };