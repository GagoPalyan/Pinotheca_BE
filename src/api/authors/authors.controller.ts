import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import type { TDataQuery } from 'src/types/global.type';

@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Get()
  getAuthors(@Query() query: TDataQuery) {
    return this.authorsService.getAuthors(query);
  }

  @Get(':id')
  getAuthorById(@Param('id') id: string) {
    return this.authorsService.getAuthorById(id);
  }

  @Post('/create')
  createAuthor(@Body() author: CreateAuthorDto) {
    return this.authorsService.createAuthor(author);
  }
}
