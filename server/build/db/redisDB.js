import { createClient } from 'redis';
export default createClient({ appendOnly: true, url: `redis://${process.env.REDIS_URL}` });
//# sourceMappingURL=redisDB.js.map