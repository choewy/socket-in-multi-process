import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';
import { ServerOptions } from 'socket.io';
import { RedisConfig } from './common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;

  async connectToRedis(config: RedisConfig): Promise<void> {
    const url = `redis://${config.host}:${config.port}`;

    const pubClint = createClient({ url });
    const subClient = pubClint.duplicate();

    await Promise.all([pubClint.connect(), subClient.connect()]);

    this.adapterConstructor = createAdapter(pubClint, subClient);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
