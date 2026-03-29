import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import type { TDataQuery } from 'src/types/global.type';
import { JwtAuthGuard, RolesGuard } from 'src/common/guard';
import { Role } from '@prisma/client';
import { Roles } from 'src/common/decorator';

@Controller('authors')
export class AuthorsController {
  constructor(
    private readonly authorsService: AuthorsService,
  ) {}

  @Get()
  getAuthors(@Query() query: TDataQuery) {
    return this.authorsService.getAuthors(query);
  }

  @Get(':id')
  getAuthorById(@Param('id') id: string) {
    return this.authorsService.getAuthorById(id);
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createAuthor(@Body() author: CreateAuthorDto) {
    return this.authorsService.createAuthor(author);
  }
}
