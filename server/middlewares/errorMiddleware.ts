import ApiError from "../exception/apiError.js";
import { Request, Response, NextFunction } from "express";

export default function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if(err instanceof ApiError) {
        return res.status(err.status).json({msg: err.message});
    }
    return res.status(500).json({ msg: 'Непрeдвиденная ошибка' });
}