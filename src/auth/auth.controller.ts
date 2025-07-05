import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MagicLinkDto, RegisterEmailDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterEmailDto) {
    return this.authService.register(dto);
  }

  @Post('magic-link')
  magicLink(@Body() dto: MagicLinkDto) {
    return this.authService.magicLink(dto);
  }
}
