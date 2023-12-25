import { createClient } from 'redis';

export default createClient({ url: `redis://${process.env.REDIS_URL}` });