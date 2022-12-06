import { registerAs } from '@nestjs/config';
import { ConfigKey } from './enums';
import { RedisConfig } from './types';

export default registerAs(
  ConfigKey.Redis,
  (): RedisConfig => ({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    lazyConnect: true,
  }),
);
