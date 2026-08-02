import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
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
export class UserInfoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly userInfoService: UserInfoService) {}

  async handleConnection(@ConnectedSocket() socket: UserSocket) {
    this.userInfoService.connection(socket);
  }

  handleDisconnect(@ConnectedSocket() socket: UserSocket) {
    console.log(`User ${socket.data.userId} disconnected`);
  }

  updateUserLikeCount(userId: string, likes: number) {
    this.server.to(`user:${userId}`).emit(UserInfoEvents.likesUpdate, likes);
  }

  updateUserCartCount(userId: string, cartCount: number) {
    this.server.to(`user:${userId}`).emit(UserInfoEvents.cartsUpdate, cartCount);
  }
}
