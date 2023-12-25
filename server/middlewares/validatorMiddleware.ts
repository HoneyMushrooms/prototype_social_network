import { validationResult, body, query } from'express-validator';
import ApiError from '../exception/apiError.js';
import { Request, Response, NextFunction } from "express";

const validationData = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        throw ApiError.BadRequest(errors.array()[0].msg);
    }
    next();
}

const validationLoginAndRegister = [
    body('*').trim().notEmpty().withMessage('Заполните все поля!'),
    body('email').isEmail().withMessage('Некорректный адрес почты!'),
    body('password').isLength({ min:3 }).withMessage('Длинна пароля не меньше 3-х символов!'),
    validationData
];

const validationFogotPassword = [
    body('email').isEmail().withMessage('Некорректный адрес почты!'),
    validationData
];

const validationResetPassword = [
    body('link').isUUID().withMessage('Некорректная ссылка!'),
    body('password').isLength({ min:3 }).withMessage('Длинна пароля не меньше 3-х символов!'),
    validationData
];

const validationUserId = [
    query('user_id').isUUID().withMessage('Некорректный id!'),
    query('liker_id').isUUID().withMessage('Некорректный id!'),
    validationData
];

export { validationLoginAndRegister, validationFogotPassword, validationResetPassword, validationUserId };
