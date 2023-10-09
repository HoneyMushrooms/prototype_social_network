import RelationshipService from "../services/relationshipService.js";

export default new class AuthController {

    async getUsersByFullName(req, res, next) {
        try {
            const id = req.id;
            const { name, surname } = req.query;
            const usersData = await RelationshipService.getUsersByFullName(id, name, surname);
    
            return res.json(usersData);
        } catch(err) {
            next(err);
        }
    }

    async getFriends(req, res, next) {
        try {
            const id = req.id;
            const friendsData = await RelationshipService.getFriends(id);
            
            return res.json(friendsData);
        } catch(err) {
            next(err);
        }
    }

    async getFollowers(req, res, next) {
        try {
            const id = req.id;
            const followersData = await RelationshipService.getFollowers(id);
            
            return res.json(followersData);
        } catch(err) {
            next(err);
        }
    }

    async getSubscriptions(req, res, next) {
        try {
            const id = req.id;
            const subscriptionsData = await RelationshipService.getSubscriptions(id);
            
            return res.json(subscriptionsData);
        } catch(err) {
            next(err);
        }
    }

    async createRequestFriend(req, res, next) {
        try {
            const user1 = req.id;
            const { user2 } = req.body;
            await RelationshipService.createRequestFriend(user1, user2);
            
            return res.sendStatus(201);
        } catch(err) {
            next(err);
        }
    }

    async createFriendFromFollower(req, res, next) {
        try {
            const user2 = req.id;
            const { user1 } = req.body;
            await RelationshipService.createFriendFromFollower(user1, user2);
            
            return res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    }

    async createFollowerFromFriend(req, res, next) {
        try {
            const user2 = req.id;
            const { user1 } = req.body;
            await RelationshipService.createFollowerFromFriend(user1, user2);
            
            return res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    }

    async deleteRequestFriend(req, res, next) {
        try {
            const user1 = req.id;
            const { user2 } = req.query;
            await RelationshipService.deleteRequestFriend(user1, user2);
            
            return res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    }
}