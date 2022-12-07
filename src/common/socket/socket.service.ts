import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';

@Injectable()
export class SocketService {
  async emitAll<T = any>(
    server: Server,
    userId: number,
    event: string,
    body: T,
  ): Promise<void> {
    for (const [, socket] of Array.from(server.sockets.sockets)) {
      if (socket.data.userId === userId) {
        socket.emit(event, body);
      }
    }
  }
}
