import { Module } from '@nestjs/common';
import { UserInfoGateway } from './user-info.gateway';
import { AuthModule } from 'src/api/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [UserInfoGateway],
  exports: [UserInfoGateway],
})
export class UserInfoModule {}
