import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import type { MagicLinkDto, RegisterEmailDto } from './dto/register.dto';
import type { LoginDto } from './dto/login.dto';
import type { ResetPasswordDto } from './dto/reset.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterEmailDto) {
    return this.authService.register(dto);
  }

  @Post('magic-link')
  magicLink(@Res({ passthrough: true }) res: Response, @Body() dto: MagicLinkDto) {
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

  @Post('forgot-password')
  forgotPassword(@Body() dto: RegisterEmailDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Res({ passthrough: true }) res: Response, @Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(res, dto);
  }
}
