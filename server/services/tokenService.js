import jwt from 'jsonwebtoken';
import { env } from 'process';
import redisDB from '../db/redisDB.js';

export default new class TokenService {
    
    generationTokens(payload) {
        const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {expiresIn: '30m'});
        const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {expiresIn: '60d'});

        return { accessToken, refreshToken };
    }

    async saveToken(id, refreshToken, fingerprint) {
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

    async removeToken(refreshToken, fingerprint, id) {
        const tokenData = await redisDB.SMEMBERS(id);

        tokenData.forEach( async (e) => {
            if(e.includes(refreshToken) && e.includes(fingerprint)) {
                await redisDB.SREM(id, e);
            }
        });
    }

    validateAccessToken(accessToken) {
        try {
            const { id } = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
            return id;
        } catch(e) {
            return null;
        }
    }
    
    validateRefreshToken(refreshToken) {
        try {
            const { id } = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            return id;
        } catch(e) {
            return null;
        }
    }

    async findToken(id, token, fingerprint) {
        const tokenData = await redisDB.SMEMBERS(id);
        let tk;
        
        tokenData.forEach( e => {
            if(e.includes(token) && e.includes(fingerprint)) {
                tk = e;
            }
        })
        
        return tk;
    }
}