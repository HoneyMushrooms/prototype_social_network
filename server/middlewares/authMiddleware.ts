import ApiError from "../exception/apiError.js";
import TokenService from "../services/tokenService.js";
import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
    try {
        if(!req.get('authorization')) {
            return next(ApiError.UnauthorizedError());
        }

        const typeToken = req.get('authorization').split(' ')[0];
        const accessToken = req.get('authorization').split(' ')[1];
        if(typeToken !== 'Bearer' || !accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const id = TokenService.validateAccessToken(accessToken);
        if(!id) {
            return next(ApiError.UnauthorizedError());
        }
        
        req.id = id;
        next();
    } catch(err) {
        next(err);
    }
}