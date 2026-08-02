import { Module } from '@nestjs/common';
import { UserInfoGateway } from './user-info.gateway';
import { AuthModule } from 'src/api/auth/auth.module';
import { UserInfoService } from './user-info.service';

@Module({
  imports: [AuthModule],
  providers: [UserInfoGateway, UserInfoService],
  exports: [UserInfoGateway],
})
export class UserInfoModule {}
