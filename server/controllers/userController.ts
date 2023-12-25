import UserService from "../services/userService.js";
import { Request, Response, NextFunction } from "express";
import ApiError from "../exception/apiError.js";

export default new class UserController {

    async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { user_id, liker_id } = req.query;
            if(typeof user_id !== 'string' || typeof liker_id !== 'string') {    
                throw ApiError.BadRequest('user_id, liker_id must be string');
            }
            const userData = await UserService.getUser(user_id, liker_id);
            
            return res.json(userData);
        } catch(err) {
            next(err);
        }
    }

    async updateUser(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.id;
            const file = req.file;
            const { name, surname, logo, city } = req.body;
            if(typeof name !== 'string' || typeof surname !== 'string' || typeof logo !== 'string' || typeof city !== 'string') {    
                throw ApiError.BadRequest('body`s fields must be string');
            }

            const userData = await UserService.updateUser(id, name, surname, logo, city, file);
            res.json(userData);
        } catch(err) {
            next(err);
        }
    }

    async createPost(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.id;
            const file = req.file;
            const { text } = req.body as { text: string | undefined };
            
            const postData = await UserService.createPost(id, file, text);
            
            return res.status(201).json(postData);
        } catch(err) {
            next(err);
        }
    }

    async deletePost(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            await UserService.daletePost(id);

            return res.sendStatus(204);
        } catch(err) {
            next(err);
        }
    }

    async getNews(req: Request, res: Response, next: NextFunction) {
        try {
            const { limit, lastItem } = req.query as { limit: string, lastItem: number | undefined};
            const id = req.id;
            
            const newsData = await UserService.getNews(id, +limit, lastItem);

            return res.json(newsData);
        } catch(err) {
            next(err);
        }
    }

    async getConversation(req: Request, res: Response, next: NextFunction) {
        try {
            const id = req.id;
            const conversationData = await UserService.getConversation(id);

            return res.json(conversationData);
        } catch(err) {
            next(err);
        }
    }

    
    async updateLikeCount(req: Request, res: Response, next: NextFunction) {
        try {
            const { post_id, user_id } = req.body as { post_id: string; user_id: string };
            const likeData = await UserService.updateLikeCount(+post_id, user_id);

            return res.json(likeData);
        } catch(err) {
            next(err);
        }
    }
}