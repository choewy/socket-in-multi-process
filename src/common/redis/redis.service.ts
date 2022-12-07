import Redis from 'ioredis';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigKey, RedisConfig } from '../config';

@Injectable()
export class RedisService {
  private readonly config: RedisConfig;
  public readonly publisher: Redis;
  public readonly subscriber: Redis;

  constructor(private readonly configService: ConfigService) {
    this.config = this.configService.get<RedisConfig>(ConfigKey.Redis);
    this.publisher = new Redis(this.config.port, this.config.host, {
      lazyConnect: true,
    });

    this.subscriber = this.publisher.duplicate();
  }

  async connect(): Promise<void> {
    await Promise.all([this.publisher.connect(), this.subscriber.connect()]);
  }
}
