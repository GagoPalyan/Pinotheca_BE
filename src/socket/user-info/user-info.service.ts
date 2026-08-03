import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConnectedSocket } from '@nestjs/websockets';
import { UserSocket } from './dto/socket.dto';

@Injectable()
export class UserInfoService {
  constructor(private readonly jwtService: JwtService) {}

  async connection(@ConnectedSocket() socket: UserSocket) {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        socket.disconnect();
        return;
      }

      const { id: userId } = await this.jwtService.verifyAsync(token);

      if (!userId) {
        socket.disconnect();
        return;
      }

      socket.data.userId = userId;

      await socket.join(`user:${userId}`);
    } catch {
      socket.disconnect();
    }
  }
}
