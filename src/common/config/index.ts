export * from './enums';
export * from './types';

import server from './server.config';
import typeorm from './typeorm.config';
import redis from './redis.config';

export const configs = [server, typeorm, redis];
