import { Injectable } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import type { TDataQuery } from 'src/types/global.type';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class AuthorsService {
  constructor(private PrismaService: PrismaService) {}

  async getAuthors({ page = 1, limit = 12, search = '' }: TDataQuery) {
    const where = search
      ? { OR: [{ firstname: { contains: search } }, { lastname: { contains: search } }] }
      : {};

    const authors = await this.PrismaService.author.findMany({
      take: limit,
      skip: (page - 1) * limit,
      where,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        about: true,
        imageUrl: true,
      },
    });

    return authors;
  }

  async getAuthorById(id: string) {
    const author = await this.PrismaService.author.findUnique({
      where: { id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        about: true,
        imageUrl: true,
      },
    });

    if (!author) throw new Error('Author not found');

    return author;
  }

  async createAuthor({ firstname, lastname, about, imageUrl }: CreateAuthorDto) {
    await this.PrismaService.author.create({
      data: {
        firstname,
        lastname,
        about,
        imageUrl,
      },
    });

    return `Author ${firstname} ${lastname} created successfully`;
  }
}
