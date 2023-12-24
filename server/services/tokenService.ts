import jwt from 'jsonwebtoken';
import redisDB from '../db/redisDB.js';
import { ITokenPayload } from './token.interface.js';

export default new class TokenService {
    
    generationTokens(payload: ITokenPayload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {expiresIn: '60d'});

        return { accessToken, refreshToken };
    }

    async saveToken(id: string, refreshToken: string, fingerprint: string) {
        const tokenData = await redisDB.SMEMBERS(id);
        tokenData.forEach( async (e) => {
            if(e.includes(fingerprint)) {
                await redisDB.SREM(id, e);
            }
        });
        
        await redisDB.SADD(id, JSON.stringify({
            refreshToken,
            fingerprint,
        }));
    }

    async removeToken(refreshToken: string, fingerprint: string, id: string) {
        const tokenData = await redisDB.SMEMBERS(id);

        tokenData.forEach( async (e) => {
            if(e.includes(refreshToken) && e.includes(fingerprint)) {
                await redisDB.SREM(id, e);
            }
        });
    }

    validateAccessToken(accessToken: string) {
        try {
            const { id } = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as ITokenPayload;
            return id;
        } catch(e) {
            return null;
        }
    }
    
    validateRefreshToken(refreshToken: string) {
        try {
            const { id } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as ITokenPayload;
            return id;
        } catch(e) {
            return null;
        }
    }

    async findToken(id: string, token: string, fingerprint: string) {
        const tokenData = await redisDB.SMEMBERS(id);
        let tk = '';
        
        tokenData.forEach( e => {
            if(e.includes(token) && e.includes(fingerprint)) {
                tk = e;
            }
        })
        
        return tk;
    }
}