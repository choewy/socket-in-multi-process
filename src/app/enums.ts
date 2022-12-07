export enum RedisSubEvent {
  Welcome = 'user::welcome',
}

export enum RedisPubEvent {
  Welcome = 'user::welcome',
}

export enum SocketSubEvent {
  Hi = 'user::say-hi',
}

export enum SocketEmitEvent {
  Hi = 'hi::to-user',
}

export enum AppEmitterPubEvent {
  Hello = 'user::hello',
}

export enum AppEmitterSubEvent {
  Hello = 'user::hello',
}
