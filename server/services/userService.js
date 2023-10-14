import { pool as postgresDB } from '../db/postgresDB.js';
import { join } from 'path';
import { rm } from 'fs/promises';

export default new class userService {

    async getUser(user_id, liker_id) {
        
        const { rows: userData } = await postgresDB.query( `
            SELECT u.id, name, surname, city, logo
              FROM public."user" u
              JOIN public.user_info i ON u.id = i.user_id
             WHERE u.id = $1`, [user_id] 
        );

        const { rows: postData } = await postgresDB.query(`
            SELECT p.*,
                   CASE WHEN l.user_id = $2 THEN true ELSE false END AS flag
              FROM public.post p
              LEFT JOIN public.like l ON p.id = l.post_id AND l.user_id = $2
             WHERE p.user_id = $1
             ORDER BY p.id DESC`, [user_id, liker_id]
        );

        const { rows: relationshipData } = await postgresDB.query(`
            SELECT
           (SELECT COUNT(*) FROM relationship WHERE user1 = $1 AND relationship_status = false) AS subscriptions,
           (SELECT COUNT(*) FROM relationship WHERE user2 = $1 AND relationship_status = false) AS followers,
           (SELECT COUNT(*) FROM relationship WHERE (user1 = $1 OR user2 = $1) AND relationship_status = true) AS friends`, [user_id]
        );

        return { userData: { ...userData[0], ...relationshipData[0] }, postData };
    }

    async createPost(id, file, text) {
        let link = '', type = '';
        if(file) {
            link = join('userFiles', id, 'posts', file.filename);
            type = (file.mimetype).split('/')[0];
        }

        const { rows: newPost } = await postgresDB.query( 'INSERT INTO public.post (text, user_id, link, type, create_time) VALUES ($1, $2, $3, $4, now()) RETURNING *', [text, id, link, type] );
        
        return newPost;
    }

    async daletePost(id) {

        const { rows: linkData } = await postgresDB.query( 'DELETE FROM public.post WHERE id = $1 RETURNING link', [id] );
        if(linkData[0].link) {
            await rm(join('files', linkData[0].link));
        }
    }

    async updateUser(id, file, name, surname, logo, city) {

        if(file) {
            if(logo !== 'default_logo/anonym.jpg') await rm(join('files', logo));
            logo = join('userFiles', id, 'logo', file.filename);
        }

        await postgresDB.query( 'UPDATE public."user" SET name = $2, surname = $3 WHERE id = $1;', [id, name, surname] );
        await postgresDB.query( 'UPDATE public.user_info SET city = $2, logo = $3 WHERE user_id = $1;', [id, city, logo] );

        return { id, name, surname, logo, city};
    }

    async getNews(id, limit, lastItem = 2147483647) {

        const { rows: newsData } = await postgresDB.query(`
            SELECT p.id as id, name, surname, uuid, create_time, text, link, type, p.like, 
                   CASE WHEN l.user_id = $1 THEN true ELSE false END AS flag 
              FROM public.user u
              JOIN (
                   SELECT CASE
                     WHEN user1 = $1 THEN user2 
                     ELSE user1 END AS uuid
                     FROM public.relationship
                    WHERE ((user1 = $1 OR user2 = $1) AND relationship_status = true) OR (user1 = $1 and relationship_status = false)
                   ) r ON r.uuid = u.id
              JOIN public.user_info ui ON r.uuid = ui.user_id  
              JOIN public.post p ON r.uuid = p.user_id
              LEFT JOIN public.like l ON p.id = l.post_id AND l.user_id = $1
             WHERE p.id < $2
             ORDER BY p.id DESC
             LIMIT $3`, [id, lastItem, limit]
        );

        return newsData;
    }

    async getConversation(id) {
    
        const { rows: conversationData } = await postgresDB.query(`
            WITH last_messages AS (
                SELECT conversation_id, text, type, create_time, ROW_NUMBER() OVER (PARTITION BY conversation_id ORDER BY id DESC) AS rn
                FROM public.message
                WHERE conversation_id IN (
                    SELECT id
                    FROM public.conversation
                    WHERE user1 = $1 OR user2 = $1
                )
            )
            SELECT uuid, u.name, u.surname, lm.text, lm.type, lm.create_time, c.id as conversation_id
              FROM public.user u
              JOIN (
                    SELECT id, CASE
                    WHEN user1 = $1 THEN user2
                    ELSE user1 END AS uuid
                    FROM public.conversation
                    WHERE user1 = $1 OR user2 = $1
                    ) c ON c.uuid = u.id
              LEFT JOIN last_messages lm ON lm.conversation_id = c.id AND lm.rn = 1`, [id]
        );

        return conversationData;
    }

    async updateLikeCount (post_id, user_id) {

        const { rows } = await postgresDB.query( 'SELECT 1 FROM public."like" WHERE post_id = $1 AND user_id = $2', [post_id, user_id] );
        let likeData, flag;

        if(rows?.length) {
            postgresDB.query( 'DELETE FROM public."like" WHERE post_id = $1 AND user_id = $2', [post_id, user_id] );
            likeData = await postgresDB.query( 'UPDATE public.post SET "like" = "like" - 1 WHERE id = $1 RETURNING "like"', [post_id] );
            flag = false;
        } else {
            postgresDB.query( 'INSERT INTO public."like" (post_id, user_id) VALUES ($1, $2)', [post_id, user_id] );
            likeData = await postgresDB.query( 'UPDATE public.post SET "like" = "like" + 1 WHERE id = $1 RETURNING "like"', [post_id] );
            flag = true;
        }

        return { like: likeData.rows[0].like, flag };
    }
}