export type RedisMessageBody<T extends object | any = any> = T & {
  userId: number;
};

export type RedisPubSubMessage<T extends object | any = any> = {
  subject: string;
  body: RedisMessageBody<T>;
};
