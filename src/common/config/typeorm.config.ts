import { registerAs } from '@nestjs/config';
import { DateTime } from 'luxon';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { ConfigKey } from './enums';
import { TypeormConfig } from './types';

export default registerAs(
  ConfigKey.Typeorm,
  (): TypeormConfig => ({
    type: process.env.TYPEORM_TYPE as any,
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    logging: process.env.TYPEORM_LOGGING === 'true',
    autoLoadEntities: process.env.TYPEORM_AUTO_LOAD_ENTITIES === 'true',
    entities: [process.cwd() + process.env.TYPEORM_ENTITIES],
    migrations: [process.cwd() + process.env.TYPEORM_MIGRATIONS],
    timezone: process.env.TYPEORM_TIMEZONE,
    namingStrategy: new SnakeNamingStrategy(),
    extra: {
      typeCast: (
        field: {
          type: string;
          string: () => string;
        },
        next: () => void,
      ) => {
        const { type } = field;

        if (type === 'DATE') {
          const val = field.string();
          return val === null ? null : DateTime.fromFormat(val, 'yyyy-MM-dd');
        }

        if (type === 'DATETIME') {
          const val = field.string();
          return val === null
            ? null
            : DateTime.fromFormat(val, 'yyyy-MM-dd HH:mm:ss');
        }

        return next();
      },
    },
  }),
);
