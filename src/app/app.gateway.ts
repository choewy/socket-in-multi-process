import { MessageService } from '@/common/message';
import { RedisService } from '@/common/redis';
import { SocketService } from '@/common/socket';
import { Logger, OnApplicationBootstrap } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  AppEmitterPubEvent,
  AppEmitterSubEvent,
  RedisPubEvent,
  RedisSubEvent,
  SocketEmitEvent,
  SocketSubEvent,
} from './enums';
import { RedisMessageBody, RedisPubSubMessage } from './types';

@WebSocketGateway()
export class AppGateway
  implements OnApplicationBootstrap, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private server: Server;
  private readonly logger = new Logger(AppGateway.name);

  private readonly CHANNEL = 'ch01';

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly redisService: RedisService,
    private readonly socketService: SocketService,
    private readonly messageService: MessageService,
  ) {}

  async onApplicationBootstrap() {
    await this.redisService.connect();
    await this.redisService.subscriber.subscribe(this.CHANNEL);
    this.redisService.subscriber.on(
      'message',
      async (channel: string, message: string) => {
        if (channel === this.CHANNEL) {
          const { subject, body } =
            this.messageService.parse<RedisMessageBody>(message);

          let event: string;

          switch (subject) {
            case RedisSubEvent.Welcome:
              event = AppEmitterPubEvent.Hello;
              break;
          }

          await this.eventEmitter.emitAsync(event, body);
        }
      },
    );
  }

  handleConnection(client: Socket) {
    client.data = {
      userId: 1,
    };

    this.logger.verbose(`{ pid : ${process.pid} } 
    - connected : {
      client : ${client.id}
    }`);
  }

  handleDisconnect(client: Socket) {
    this.logger.verbose(`{ pid : ${process.pid} } 
    - disconnected : {
      client : ${client.id}
    }`);
  }

  @SubscribeMessage(SocketSubEvent.Hi)
  async hi(): Promise<void> {
    this.redisService.publisher.publish(
      this.CHANNEL,
      this.messageService.toString<RedisPubSubMessage>({
        subject: RedisPubEvent.Welcome,
        body: {
          userId: 1,
          hi: 'welcome, bro',
        },
      }),
    );
  }

  @OnEvent(AppEmitterSubEvent.Hello)
  async hello({ userId, ...body }: RedisMessageBody) {
    return this.socketService.emitAll(
      this.server,
      userId,
      SocketEmitEvent.Hi,
      body,
    );
  }
}
