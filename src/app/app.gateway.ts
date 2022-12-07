import { RedisService } from '@/common/redis';
import { OnApplicationBootstrap } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
  implements
    OnApplicationBootstrap,
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect
{
  @WebSocketServer() private server: Server;
  private readonly CHANNEL = 'ch01';

  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly redisService: RedisService,
  ) {}

  async onApplicationBootstrap() {
    await this.redisService.connect();
    await this.redisService.subscriber.subscribe(this.CHANNEL);
    this.redisService.subscriber.on(
      'message',
      async (channel: string, message: string) => {
        if (channel === this.CHANNEL) {
          const { subject, body } = this.parseToJSON(message);
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

  jsonToString(obj: RedisPubSubMessage): string {
    try {
      return JSON.stringify(obj);
    } catch (e) {
      return '';
    }
  }

  parseToJSON(str: string): RedisPubSubMessage {
    try {
      return JSON.parse(str);
    } catch (e) {
      return {
        subject: '',
        body: {},
      };
    }
  }

  afterInit(server: Server) {
    this.server = server;
    return server;
  }

  handleConnection(client: Socket) {
    client.data = {
      userId: 1,
    };

    console.log(`{ pid : ${process.pid} } 
    - connected : {
      client : ${client.id}
    }`);
  }

  handleDisconnect(client: Socket) {
    console.log(`{ pid : ${process.pid} } 
    - disconnected : {
      client : ${client.id}
    }`);
  }

  private getSocket(userId: number): Socket {
    return Array.from(this.server.sockets.sockets).reduce<Socket | null>(
      (pick, [, socket]) => {
        if (socket.data.userId === userId) {
          pick = socket;
        }

        return pick;
      },
      null,
    );
  }

  @SubscribeMessage(SocketSubEvent.Hi)
  async hi(): Promise<void> {
    this.redisService.publisher.publish(
      this.CHANNEL,
      this.jsonToString({
        subject: RedisPubEvent.Welcome,
        body: {
          userId: 1,
          hi: 'welcome, bro',
        },
      }),
    );
  }

  @OnEvent(AppEmitterSubEvent.Hello)
  async hello(body: RedisMessageBody) {
    const socket = this.getSocket(body.userId);

    if (socket) {
      socket.emit(SocketEmitEvent.Hi, body);
    }
  }
}
