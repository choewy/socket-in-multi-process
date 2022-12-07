import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigKey, configs, TypeormConfig } from './config';
import { MessageService } from './message';
import { RedisService } from './redis';
import { SocketService } from './socket';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      load: configs,
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory(configService: ConfigService) {
        return configService.get<TypeormConfig>(ConfigKey.Typeorm);
      },
    }),
  ],
  providers: [RedisService, SocketService, MessageService],
  exports: [RedisService, SocketService, MessageService],
})
export class CommonModule {}
