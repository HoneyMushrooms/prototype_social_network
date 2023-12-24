interface IRelationship {
    name: string; 
    surname: string;
    uuid: string;
    logo: string;
}

interface IFind extends IRelationship {
    user1: string;
    relationship_status: boolean;
}

export { IRelationship, IFind };