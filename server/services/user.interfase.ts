interface IUser {
    id: string;
    name: string;
    surname: string;
}

interface IUserInfo {
    id: number;
    name: string;
    surname: string;
    user_id: string;
    city: string;
    logo: string;
}

interface IUserData extends IUser, Omit<IUserInfo, 'id' | 'user_id'> {}

interface IPost {
    id: number;
    text: string;
    user_id: string;
    link: string;
    type: string;
    create_time: string;
    like: number;
}

interface IPostData extends IPost {
    flag: boolean; 
}

interface IDeletePost extends Pick<IPost, 'link'> {}
  
interface IRelationshipData {
    subscriptions: number;
    followers: number;
    friends: number;
}

interface INewsData extends Pick<IUserInfo, 'name' | 'surname'>, Omit<IPost, 'user_id'>, IPostData {    
    uuid: string, // UUID друга
}

interface ConversationData extends Pick<IUserInfo, 'name' | 'surname'> {
    uuid: string; // UUID друга
    text?: string; // Текст последнего сообщения в беседе
    type?: string; // Тип последнего сообщения
    create_time?: string; // Время создания последнего сообщения
    conversation_id: number;
}

interface IlikeData {
    like: number;
}

export { 
    IUserData, 
    IRelationshipData, 
    IPostData, 
    IPost, 
    IDeletePost,
    INewsData, 
    ConversationData,
    IlikeData,
};
