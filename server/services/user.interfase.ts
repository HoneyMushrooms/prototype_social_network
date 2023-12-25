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
    user_id: string;
    text: string | null;
    link: string | null;
    type: string | null;
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
    uuid: string;
    text?: string | null; 
    type?: string | null; 
    create_time?: string; 
    conversation_id: number;
}

interface IlikeData {
    like: number;
}

interface IActive {
    id: number;       
    isActive: boolean;
    link: string;     
    user_id: string;  
}

interface IResetPassword {
    id: number;              
    reset_link: string;      
    user_id: string;         
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
    IUserInfo,
    IUser,
    IActive,
    IResetPassword,
};
