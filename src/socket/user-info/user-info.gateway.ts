import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserInfoService } from './user-info.service';

@WebSocketGateway({
  namespace: '/user-info',
})
export class UserInfoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly userInfoService: UserInfoService) {}

  async handleConnection(@ConnectedSocket() socket: Socket) {
    this.userInfoService.connection(socket);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log(`User ${socket.data.userId} disconnected`);
  }

  updateUserLikeCount(userId: string, likes: number) {
    this.userInfoService.likesUpdate(userId, likes);
  }

  updateUserCartCount(userId: string, cartCount: number) {
    this.userInfoService.cartsUpdate(userId, cartCount);
  }
}
