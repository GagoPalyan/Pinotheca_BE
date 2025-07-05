import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MagicLinkDto, RegisterEmailDto } from './dto/register.dto';
import { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterEmailDto) {
    return this.authService.register(dto);
  }

  @Post('magic-link')
  magicLink(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: MagicLinkDto,
  ) {
    return this.authService.magicLink(res, dto);
  }

  @Post('login')
  login(@Res({ passthrough: true }) res: Response, @Body() dto: LoginDto) {
    return this.authService.login(res, dto);
  }

  @Post('refresh')
  refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.authService.refresh(req, res);
  }
}
