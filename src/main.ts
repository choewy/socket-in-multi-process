import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app';
import { ConfigService } from '@nestjs/config';
import { ConfigKey, RedisConfig, ServerConfig } from './common';
import { RedisIoAdapter } from './adapter';

(async () => {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const { port, host } = configService.get<ServerConfig>(ConfigKey.Server);

  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis(
    configService.get<RedisConfig>(ConfigKey.Redis),
  );

  app.useWebSocketAdapter(redisIoAdapter);

  await app.listen(port, host);

  if (process.env.pm_id) {
    process.send('ready');
  }
})();
