import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { LayoutService } from './layout.service';
import { I18n, I18nContext } from 'nestjs-i18n';
import { JwtAuthGuard } from 'src/common/guard';
import { Request } from 'express';

@Controller('layout')
export class LayoutController {
  constructor(private readonly layoutService: LayoutService) {}

  @Get('user-info')
  @UseGuards(JwtAuthGuard)
  me(@Req() req: Request, @I18n() i18n: I18nContext) {
    return this.layoutService.userInfo(req, i18n);
  }
}
