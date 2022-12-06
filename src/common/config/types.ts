import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { NextHandleFunction } from 'connect';
import { RedisOptions } from 'ioredis';

export type ServerConfig = {
  port: number;
  host: string;
  json: NextHandleFunction;
  urlencoded: NextHandleFunction;
};

export type RedisConfig = RedisOptions;

export type TypeormConfig = TypeOrmModuleOptions;
