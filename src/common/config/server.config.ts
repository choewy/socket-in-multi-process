import { registerAs } from '@nestjs/config';
import { json, urlencoded } from 'express';
import { ServerConfig } from './types';
import { ConfigKey } from './enums';

export default registerAs(
  ConfigKey.Server,
  (): ServerConfig => ({
    port: parseInt(process.env.PORT),
    host: process.env.HOST,
    json: json({ limit: process.env.LIMIT }),
    urlencoded: urlencoded({ limit: process.env.LIMIT, extended: true }),
  }),
);
