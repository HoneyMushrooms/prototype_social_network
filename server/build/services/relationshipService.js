import { pool as postgresDB } from '../db/postgresDB.js';
export default new class relationshipService {
    async getUsersByFullName(id, name, surname) {
        const { rows } = await postgresDB.query(`
            SELECT u.id as uuid, u.name, u.surname, ui.logo, r.relationship_status, user1
              FROM public.user u
              LEFT JOIN public.user_info ui ON u.id = ui.user_id
              LEFT JOIN public.relationship r ON ((r.user1 = u.id AND r.user2 = $3) OR (r.user2 = u.id AND r.user1 = $3))
             WHERE u.name = $1 AND u.surname = $2 AND u.id <> $3`, [name, surname, id]);
        const usersData = rows.map(user => {
            if (user.relationship_status) {
                return { ...user, text: 'Удалить из друзей' };
            }
            else if (id === user.user1 && !user.relationship_status) {
                return { ...user, text: 'Отменить заявку в друзья' };
            }
            else if (id !== user.user1 && !user.relationship_status && user.user1 !== null) {
                return { ...user, text: 'Принять заявку в друзья' };
            }
            else {
                return { ...user, text: 'Отправить заявку в друзья' };
            }
        });
        return usersData;
    }
    async getFriends(id) {
        const { rows } = await postgresDB.query(`
            SELECT name, surname, uuid, logo
              FROM public.user u
              JOIN (
                   SELECT CASE
                     WHEN user1 = $1 THEN user2 
                     ELSE user1 END AS uuid
                     FROM public.relationship
                    WHERE (user1 = $1 OR user2 = $1) AND relationship_status = true
                    ) r ON r.uuid = u.id
              JOIN public.user_info ui ON r.uuid = ui.user_id`, [id]);
        const friendsData = rows.map(friend => ({ ...friend, text: 'Удалить из друзей' }));
        return friendsData;
    }
    async getFollowers(id) {
        const { rows } = await postgresDB.query(`
            SELECT name, surname, user1 as uuid, logo
              FROM public.user u
              JOIN public.relationship r ON r.user1 = u.id AND relationship_status = false AND user2 = $1
              JOIN public.user_info ui ON ui.user_id = r.user1
              `, [id]);
        const followersData = rows.map(follower => ({ ...follower, text: 'Принять заявку в друзья' }));
        return followersData;
    }
    async getSubscriptions(id) {
        const { rows } = await postgresDB.query(`
            SELECT name, surname, user2 as uuid, logo
              FROM public.user u
              JOIN public.relationship r ON r.user2 = u.id AND relationship_status = false AND user1 = $1
              JOIN public.user_info ui ON ui.user_id = r.user2
              `, [id]);
        const subscriptionsData = rows.map(subscription => ({ ...subscription, text: 'Отменить заявку в друзья' }));
        return subscriptionsData;
    }
    async createRequestFriend(user1, user2) {
        await postgresDB.query(`INSERT INTO public.relationship (user1, user2) VALUES ($1, $2)`, [user1, user2]);
    }
    async deleteRequestFriend(user1, user2) {
        await postgresDB.query(`DELETE FROM public.relationship WHERE user1 = $1 AND user2 = $2`, [user1, user2]);
    }
    async createFriendFromFollower(user1, user2) {
        await Promise.all([
            postgresDB.query(`UPDATE public.relationship SET relationship_status = true WHERE user1 = $1 AND user2 = $2`, [user1, user2]),
            postgresDB.query(`INSERT INTO public.conversation (user1, user2) VALUES ($1, $2)`, [user1, user2])
        ]);
    }
    async createFollowerFromFriend(user1, user2) {
        await Promise.all([
            postgresDB.query(`
                UPDATE public.relationship 
                   SET relationship_status = false,
                       user1 = $1,
                       user2 = $2
                 WHERE (user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1)`, [user1, user2]),
            postgresDB.query(`DELETE FROM public.conversation WHERE (user1 = $1 AND user2 = $2) OR (user1 = $2 AND user2 = $1)`, [user1, user2])
        ]);
    }
};
//# sourceMappingURL=relationshipService.js.map