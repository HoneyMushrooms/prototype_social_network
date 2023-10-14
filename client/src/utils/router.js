export const host = "http://localhost:5000";
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/registration`;
export const fogotPassword = `${host}/api/auth/forgot-password`;
export const resetPassword = `${host}/api/auth/reset-password`;
export const refreshRoute = `${host}/api/auth/refresh`;
export const logoutRoute = `${host}/api/auth/logout`;
export const token = `${host}/api/auth/token`;
export const getUser = `${host}/api/user`;
export const updateUser = `${host}/api/user`;
export const createPost = `${host}/api/user/post`;
export const deletePost = `${host}/api/user/post`;
export const setLike = `${host}/api/user/like`;

export const subscription = `${host}/api/relationship/subscription`;
export const follower = `${host}/api/relationship/follower`;
export const friend = `${host}/api/relationship/friend`;
export const findPeople = `${host}/api/relationship/find`;

export const daleteRequestFriend = `${host}/api/relationship/subscription`;
export const createFriendFromFollower = `${host}/api/relationship/follower`;
export const createFollowerFromFriend = `${host}/api/relationship/friend`;
export const createRequestFriend = `${host}/api/relationship/person`;

export const getNews = `${host}/api/user/news`;

export const getConversation = `${host}/api/user/conversation`;

export const getMessages = `${host}/api/message`;
export const addMessage = `${host}/api/message`;


