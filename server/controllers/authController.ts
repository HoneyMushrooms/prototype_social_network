import AuthService from "../services/authService.js";
import { Request, Response, NextFunction } from "express";

export default new class AuthController {

    async registration(req, res, next) {
        try {
            const { name, surname, city, email, password, fingerprint } = req.body;
            const { tokens, userData } = await AuthService.registration(name, surname, city, email, password, fingerprint);
            
            return res.status(201)
               .cookie('refreshToken', tokens.refreshToken, {maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true})
               .cookie('first_visit', 'Подтвердите почту!')
               .json({ accessToken: tokens.accessToken , userData });
        } catch(err) {
            next(err);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password, fingerprint } = req.body;
            const { tokens, userData } = await AuthService.login(email, password, fingerprint);
        
            return res.cookie('refreshToken', tokens.refreshToken, {maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true})
                .json({ accessToken: tokens.accessToken , userData });
        } catch(err) {
            next(err);
        }
    }

    async active(req: Request, res: Response, next: NextFunction) {
        try {
            const { link } = req.params;
            await AuthService.activate(link); 
            
            return res.redirect(301, process.env.CLIENT_URL + '/main?confirm_email=Вы успешно подтвердили почту!');
        } catch(err) {
            next(err);
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const id = await AuthService.forgotPassword(email);
            
            return res.json('На вашу почту были отправленны инструкции сброса пароля!');
        } catch(err) {
            next(err);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { link, password } = req.body;
            await AuthService.resetPassword(link, password);
            
            return res.json('Пароль успешно изменен!');
        } catch(err) {
            next(err);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            const { fingerprint } = req.body
            const { tokens, userData } = await AuthService.refresh(refreshToken, fingerprint);

            return res.cookie('refreshToken', tokens.refreshToken, {maxAge: 60 * 24 * 60 * 60 * 1000, httpOnly: true})
                .json({ accessToken: tokens.accessToken , userData });
        } catch (err) {
            next(err);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            const { fingerprint } = req.body; 
            const id = req.id;
            await AuthService.logout(refreshToken, fingerprint, id);
            
            return res.clearCookie('refreshToken').sendStatus(204);
        } catch (err) {
            next(err);
        }
    }
}