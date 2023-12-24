interface IUserData {
    id: string;
    name: string;
    surname: string;
    city: string;
    logo: string;
}

interface IRelationshipData {
    subscriptions: number;
    followers: number;
    friends: number;
}

export { IUserData, IRelationshipData };
