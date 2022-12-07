export type RedisMessageBody<T = any> = T & {
  userId: number;
};

export type RedisPubSubMessage<T = any> = {
  subject: string;
  body: RedisMessageBody<T>;
};
