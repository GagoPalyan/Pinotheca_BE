import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { MagicLinkDto, RegisterEmailDto, LoginDto, ResetPasswordDto } from './dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { JwtAuthGuard } from 'src/common/guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterEmailDto, @I18n() i18n: I18nContext) {
    return this.authService.register(dto, i18n);
  }

  @Post('magic-link')
  magicLink(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: MagicLinkDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.authService.magicLink(res, dto, i18n);
  }

  @Post('login')
  login(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: LoginDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.authService.login(res, dto, i18n);
  }

  @Get('refresh')
  refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @I18n() i18n: I18nContext,
  ) {
    return this.authService.refresh(req, res, i18n);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: RegisterEmailDto, @I18n() i18n: I18nContext) {
    return this.authService.forgotPassword(dto, i18n);
  }

  @Post('reset-password')
  resetPassword(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: ResetPasswordDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.authService.resetPassword(res, dto, i18n);
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request, @I18n() i18n: I18nContext) {
    return this.authService.me(req, i18n);
  }
}
