import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app';
import { ConfigService } from '@nestjs/config';
import { ConfigKey, ServerConfig } from './common';

(async () => {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const { port, host } = configService.get<ServerConfig>(ConfigKey.Server);

  await app.listen(port, host);

  if (process.env.pm_id) {
    process.send('ready');
  }
})();
