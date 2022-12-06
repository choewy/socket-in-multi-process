import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() private server: Server;

  afterInit(server: Server) {
    this.server = server;
    return server;
  }

  handleConnection(client: Socket) {
    client.handshake.auth = {
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

  private findSocketByUserId(userId: number): Socket {
    return Array.from(this.server.sockets.sockets).reduce<Socket | null>(
      (pick, [, socket]) => {
        if (socket.handshake.auth.userId === userId) {
          pick = socket;
        }

        return pick;
      },
      null,
    );
  }

  @SubscribeMessage('hi')
  async welcome(@ConnectedSocket() client: Socket): Promise<void> {
    const socket = this.findSocketByUserId(1);

    console.log(
      `{ pid : ${process.pid} } 
      - hi : { 
        client : ${client.id}, 
        socket : ${socket.id} 
      }`,
    );

    socket.emit('welcome', {
      hi: 'welcome, bro',
    });
  }
}
