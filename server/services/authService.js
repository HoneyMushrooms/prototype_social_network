import { pool as postgresDB } from '../db/postgresDB.js';
import bcrypt from "bcrypt";
import { v4 } from 'uuid';
import MailService from "./mailService.js";
import { env } from 'process';
import TokenService from "./tokenService.js";
import ApiError from "../exception/apiError.js";
import MailTemplate from '../templates/mailTemplates.js';

export default new class AuthService {

    async registration(name, surname, city, email, password, fingerprint) {
        const { rows } = await postgresDB.query( 'SELECT * FROM public.user_info WHERE email = $1', [email] );
        
        if(rows.length !== 0) {
            throw ApiError.BadRequest(`Пользователь с таким почтовым адресом ${email} уже существует!`);
        }
        
        const hashPassword = bcrypt.hashSync(password, 7);
        const activationLink = v4();
        const reset_link = v4();
        const id = v4();
        
        await postgresDB.query( 'INSERT INTO public.user (id, name, surname) VALUES ($1, $2, $3)', [id, name, surname] );
        const { rows: logo } = await postgresDB.query( 'INSERT INTO public.user_info (email, city, password, user_id) VALUES ($1, $2, $3, $4) RETURNING logo', [email, city, hashPassword, id] );
        await postgresDB.query( 'INSERT INTO public.active (link, user_id) VALUES ($1, $2)', [ activationLink, id] );
        await postgresDB.query( 'INSERT INTO public.reset_password (reset_link, user_id) VALUES ($1, $2)', [ reset_link, id] );

        const template = MailTemplate.registerHTML(`${env.API_URL}/api/auth/activate/${activationLink}`);

        await MailService.sendActivationMail(email, template);

        const tokens = TokenService.generationTokens({ id });
        await TokenService.saveToken(id, tokens.refreshToken, fingerprint);

        return { tokens, userData: { name, surname, id, city, logo: logo[0].logo }};
    }

    async login(email, password, fingerprint) {
        const userInfoData = await postgresDB.query( 'SELECT * FROM public.user_info WHERE email = $1', [email] );
        
        if(userInfoData.rows.length == 0) {
            throw ApiError.BadRequest(`Пользователь с таким почтовым адресом ${email} не существует!`);
        }
        const userInfo = userInfoData.rows[0];

        const validPassword = bcrypt.compareSync(password, userInfo.password);
        if(!validPassword) {
            throw ApiError.BadRequest("Введен неверный пароль!");
        }

        const userData = await postgresDB.query( 'SELECT * FROM public.user WHERE id = $1', [userInfo.user_id] );
        const user = userData.rows[0];

        const tokens = TokenService.generationTokens({ id: user.id });
        await TokenService.saveToken(user.id, tokens.refreshToken, fingerprint);

        return { tokens, userData: { name: user.name, surname: user.surname, id: user.id, city: userInfo.city, logo: userInfo.logo }};
    }

    async activate(link) {
        const activeData = await postgresDB.query( 'SELECT * FROM public.active WHERE link = $1', [link] );
    
        if(activeData.rows.length === 0) {
            throw ApiError.BadRequest(`Неккоректная ссылка активации!`);
        }
     
        await postgresDB.query( 'UPDATE public.active SET "isActive" = true WHERE link = $1', [link] );
    }

    async forgotPassword(email) {
        
        const userInfoData = await postgresDB.query( 'SELECT * FROM public.user_info WHERE email = $1', [email] );
    
        if(userInfoData.rows.length === 0) {
            throw ApiError.BadRequest(`Данный почтовый ящик не зарегистрирован!`);
        }
        
        const userInfo = userInfoData.rows[0];
    
        const activeData = await postgresDB.query( 'SELECT * FROM public.active WHERE user_id = $1', [userInfo.user_id] );
        const active = activeData.rows[0];

        if(!active.isActive) {
            throw ApiError.BadRequest(`Данный почтовый ящик не подтвержден!`);
        }
        
        const { rows: [ link ] } = await postgresDB.query( 
            `SELECT reset_link FROM public.reset_password WHERE user_id = $1`, 
        [userInfo.user_id] );

        const template = MailTemplate.resetHTML(`${env.CLIENT_URL}/reset-password/${link.reset_link}`);
        await MailService.sendActivationMail(email, template);
    }
    
    async resetPassword(link, password) {
        
        const resetData = await postgresDB.query( 
            `SELECT * FROM public.reset_password WHERE reset_link = $1`, 
        [link] );

        if(resetData.rows.length === 0) {
            throw new Error(); // вероятно взлом
        }
        
        const id = resetData.rows[0].user_id;
        const hashPassword = bcrypt.hashSync(password, 7);
        const newResetLink = v4();

        await postgresDB.query( 'UPDATE public.user_info SET password = $1 WHERE user_id = $2', [hashPassword, id] );
        await postgresDB.query( 'UPDATE public.reset_password SET reset_link = $1 WHERE user_id = $2', [newResetLink, id] );
    }

    async logout(refreshToken, fingerprint, id) {
        await TokenService.removeToken(refreshToken, fingerprint, id);
    }

    async refresh(refreshToken, fingerprint) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        
        const id = TokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await TokenService.findToken(id, refreshToken, fingerprint);
        if (!id || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        
        const tokens = TokenService.generationTokens({ id });
        await TokenService.saveToken(id, tokens.refreshToken, fingerprint);
        
        const {rows: userData} = await postgresDB.query( `
            SELECT name, surname, city, logo 
             FROM public.user u
             JOIN public.user_info ui ON ui.user_id = u.id
             WHERE u.id = $1`, [id] 
        );
        const user = userData[0];
        return { tokens, userData: { name: user.name, surname: user.surname, logo: user.logo, city: user.city, id }};
    }
}