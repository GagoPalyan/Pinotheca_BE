import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { UserSocket } from './dto/socket.dto';

@Injectable()
export class UserInfoService {
  constructor(private readonly jwtService: JwtService) {}

  async connection(@ConnectedSocket() socket: UserSocket) {
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
}
