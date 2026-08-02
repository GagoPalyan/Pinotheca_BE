import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserInfoEvents } from './dto';

@Injectable()
export class UserInfoService {
  @WebSocketServer()
  private server: Server;

  constructor(private readonly jwtService: JwtService) {}

  async connection(@ConnectedSocket() socket: Socket) {
    console.log(`Socket connected: ${socket.id}`);
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        socket.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync(token);

      const userId = payload.id;

      if (!userId) {
        socket.disconnect();
        return;
      }

      socket.data.userId = userId;

      await socket.join(`user:${userId}`);

      console.log(`User ${userId} connected: ${socket.id}`);
    } catch {
      socket.disconnect();
    }
  }

  likesUpdate(userId: string, likes: number) {
    this.server.to(`user:${userId}`).emit(UserInfoEvents.likesUpdate, likes);
  }

  cartsUpdate(userId: string, cartCount: number) {
    this.server.to(`user:${userId}`).emit(UserInfoEvents.cartsUpdate, cartCount);
  }
}
