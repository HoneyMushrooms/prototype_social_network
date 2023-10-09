import ApiError from "../exception/apiError.js";

export default function errorMiddleware(err, req, res, next) {
    console.error(err);
    if(err instanceof ApiError) {
        return res.status(err.status).json({msg: err.message});
    }
    return res.status(500).json({msg: 'Непрeдвиденная ошибка'});
}