import ApiError from "../exception/apiError.js";
import TokenService from "../services/tokenService.js";
import { Request, Response, NextFunction } from "express";

export default function (req: Request, res: Response, next: NextFunction) {
    try {

        const authorizationData = req.get('authorization');
        if(!authorizationData) {
            return next(ApiError.UnauthorizedError());
        }

        const [typeToken, accessToken] = authorizationData.split(' ');
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