import {
  ConnectedSocket,
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UserInfoService } from './user-info.service';
import { UserInfoEvents } from './dto';
import { UserSocket } from './dto/socket.dto';

@WebSocketGateway({
  namespace: '/user-info',
})
export class UserInfoGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly userInfoService: UserInfoService) {}

  async handleConnection(@ConnectedSocket() socket: UserSocket) {
    this.userInfoService.connection(socket);
  }

  updateUserLikeCount(userId: string, likes: number) {
    this.server.to(`user:${userId}`).emit(UserInfoEvents.likesUpdate, likes);
  }

  updateUserCartCount(userId: string, cartCount: number) {
    this.server.to(`user:${userId}`).emit(UserInfoEvents.cartsUpdate, cartCount);
  }
}
