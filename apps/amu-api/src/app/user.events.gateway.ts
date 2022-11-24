import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { from, Observable, map } from 'rxjs';
import { Server } from 'socket.io';
import { DEFAULT_USER } from './user.constants';
import { User } from './user.interface';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'user',
})
export class UserEventsGateway {
  @WebSocketServer()
  server: Server;

  /**
   * Example with observables
   * @returns The user stream
   */
  @SubscribeMessage('events')
  findAll(): Observable<WsResponse<User>> {
    const event = 'events';
    const response = [DEFAULT_USER];

    return from(response).pipe(map((user) => ({ event, data: user })));
  }

  /**
   * Example with promise
   * @param data the data from the client
   * @returns the data updated
   */
  @SubscribeMessage('ready')
  async identity(@MessageBody() data: User): Promise<User> {
    data.isReady = true;

    return data;
  }
}
