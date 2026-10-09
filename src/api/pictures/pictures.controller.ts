import { Controller, Get, Post, Body, Param, UseGuards, Query, Request } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { JwtAuthGuard, RolesGuard } from '@/common/guard';
import { Roles } from '@/common/decorator';
import { Role } from '@prisma/client';
import { I18n, I18nContext } from 'nestjs-i18n';
import { CreatePictureDto, GetPictureQueryDto } from './dto';
import type { Request as ExpressRequest } from 'express';

@Controller('pictures')
export class PicturesController {
  constructor(private readonly picturesService: PicturesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createPictureDto: CreatePictureDto, @I18n() i18n: I18nContext) {
    return this.picturesService.create(createPictureDto, i18n);
  }

  @Get()
  findAll(@Request() req: ExpressRequest, @Query() query: GetPictureQueryDto) {
    return this.picturesService.findAll(req, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: ExpressRequest, @I18n() i18n: I18nContext) {
    return this.picturesService.findOne(id, req, i18n);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  like(@Request() req: ExpressRequest, @Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.picturesService.like(id, req.user, i18n);
  }

  @Post(':id/cart')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  cart(@Request() req: ExpressRequest, @Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.picturesService.cart(id, req.user, i18n);
  }

  @Post(':id/share')
  share(@Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.picturesService.share(id, i18n);
  }
}
