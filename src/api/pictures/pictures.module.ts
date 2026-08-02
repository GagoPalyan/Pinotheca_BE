import { Module } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { PicturesController } from './pictures.controller';
import { AuthModule } from '../auth/auth.module';
import { UserInfoModule } from 'src/socket/user-info/user-info.module';

@Module({
  imports: [AuthModule, UserInfoModule],
  controllers: [PicturesController],
  providers: [PicturesService],
})
export class PicturesModule {}
