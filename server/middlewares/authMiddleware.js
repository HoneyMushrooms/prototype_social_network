import ApiError from "../exception/apiError.js";
import TokenService from "../services/tokenService.js";

export default function (req, res, next) {
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