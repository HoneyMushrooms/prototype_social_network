import RelationshipService from "../services/relationshipService.js";
import { Request, Response, NextFunction } from "express";

export default new class AuthController {

    async getUsersByFullName(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.id;
            const { name, surname } = req.query as { [key: string]: string; };;
            const usersData = await RelationshipService.getUsersByFullName(id, name, surname);
    
            return res.json(usersData);
        } catch(err) {
            next(err);
        }
    }

    async getFriends(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.id;
            const friendsData = await RelationshipService.getFriends(id);
            
            return res.json(friendsData);
        } catch(err) {
            next(err);
        }
    }

    async getFollowers(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.id;
            const followersData = await RelationshipService.getFollowers(id);
            
            return res.json(followersData);
        } catch(err) {
            next(err);
        }
    }

    async getSubscriptions(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.id;
            const subscriptionsData = await RelationshipService.getSubscriptions(id);
            
            return res.json(subscriptionsData);
        } catch(err) {
            next(err);
        }
    }

    async createRequestFriend(req: Request, res: Response, next: NextFunction) {
        try {
            const user1 = req.id;
            const { user2 } = req.body as { [key: string]: string; };
            await RelationshipService.createRequestFriend(user1, user2);
            
            return res.sendStatus(201);
        } catch(err) {
            next(err);
        }
    }

    async createFriendFromFollower(req: Request, res: Response, next: NextFunction) {
        try {
            const user2 = req.id;
            const { user1 } = req.body as { [key: string]: string; };
            await RelationshipService.createFriendFromFollower(user1, user2);
            
            return res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    }

    async createFollowerFromFriend(req: Request, res: Response, next: NextFunction) {
        try {
            const user2 = req.id;
            const { user1 } = req.body as { [key: string]: string; };
            await RelationshipService.createFollowerFromFriend(user1, user2);
            
            return res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    }

    async deleteRequestFriend(req: Request, res: Response, next: NextFunction) {
        try {
            const user1 = req.id;
            const { user2 } = req.query as { [key: string]: string; };
            await RelationshipService.deleteRequestFriend(user1, user2);
            
            return res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    }
}