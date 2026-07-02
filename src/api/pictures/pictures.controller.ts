import { Controller, Get, Post, Body, Param, UseGuards, Query, Request } from '@nestjs/common';
import { PicturesService } from './pictures.service';
import { JwtAuthGuard, RolesGuard } from 'src/common/guard';
import { Roles } from 'src/common/decorator';
import { Role } from '@prisma/client';
import { I18n, I18nContext } from 'nestjs-i18n';
import { CreatePictureDto, GetPictureQueryDto } from './dto';
import type { Request as ExpressRequest } from 'express';

@Controller('pictures')
export class PicturesController {
  constructor(private readonly picturesService: PicturesService) {}

  @Post('/create')
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
  findOne(@Param('id') id: string) {
    return this.picturesService.findOne(id);
  }

  @Post('/like/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.USER)
  like(@Request() req: ExpressRequest, @Param('id') id: string, @I18n() i18n: I18nContext) {
    return this.picturesService.like(id, req.user, i18n);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePictureDto: UpdatePictureDto) {
  //   return this.picturesService.update(+id, updatePictureDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.picturesService.remove(+id);
  // }
}
