import UserService from "../services/userService.js";

export default new class AuthController {

    async getUser(req, res, next) {
        try {
            const { id } = req.query;
            const userData = await UserService.getUser(id);
            
            return res.json(userData);
        } catch(err) {
            next(err);
        }
    }

    async updateUser(req, res, next) {
        try {
            const id = req.id;
            const file = req.file;
            const { name, surname, logo, city } = req.body;

            const userData = await UserService.updateUser(id, file, name, surname, logo, city);
            res.json(userData);
        } catch(err) {
            next(err);
        }
    }

    async createPost(req, res, next) {
        try {
            const id = req.id;
            const file = req.file;
            const { text } = req.body;
    
            const postData = await UserService.createPost(id, file, text);
            
            return res.status(201).json(postData);
        } catch(err) {
            next(err);
        }
    }

    async deletePost(req, res, next) {
        try {
            const { id } = req.params;
            await UserService.daletePost(id);

            return res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    }

    async getNews(req, res, next) {
        try {
            const { limit, lastItem } = req.query;
            const id = req.id;
            const newsData = await UserService.getNews(id, limit, lastItem);

            return res.json(newsData);
        } catch(err) {
            next(err);
        }
    }

    async getConversation(req, res, next) {
        try {
            const id = req.id;
            const conversationData = await UserService.getConversation(id);

            return res.json(conversationData);
        } catch(err) {
            next(err);
        }
    }

    
    async updateLikeCount(req, res, next) {
        try {
            const { post_id, user_id } = req.body;
            const likeData = await UserService.updateLikeCount(post_id, user_id);

            return res.json(likeData);
        } catch(err) {
            next(err);
        }
    }
}