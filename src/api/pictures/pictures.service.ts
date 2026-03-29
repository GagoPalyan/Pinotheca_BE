import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePictureDto } from './dto/create-picture.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { I18nContext } from 'nestjs-i18n';
import type { GetPictureQueryDto } from './dto';

const cardImageSelector = {
  id: true,
  title: true,
  imageUrl: true,
  price: true,
  width: true,
  height: true,
  author: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
    },
  },
};

@Injectable()
export class PicturesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPictureDto: CreatePictureDto, i18n: I18nContext) {
    const author = await this.prismaService.author.findUnique({
      where: { id: createPictureDto.authorId },
    });

    if (!author) throw new NotFoundException(i18n.t('backend.authors.not_found'));

    await this.prismaService.picture.create({
      data: createPictureDto,
    });

    return i18n.t('backend.pictures.created');
  }

  async findAll(query: GetPictureQueryDto) {
    const { search = '', page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;

    const [pictures, total] = await this.prismaService.$transaction([
      this.prismaService.picture.findMany({
        where: {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        select: cardImageSelector,
      }),
      this.prismaService.picture.count({
        where: {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: pictures,
      meta: {
        total: 200,
        page,
        limit,
        totalPages: 20,
      },
    };
  }

  findOne(id: string) {
    return this.prismaService.picture.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        price: true,
        width: true,
        height: true,
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            imageUrl: true,
            pictures: {
              where: { isSold: false, id: { not: id } },
              take: 3,
              select: cardImageSelector,
            },
          },
        },
        isSold: true,
        material: true,
        paint: true,
        type: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });
  }

  // update(id: number, updatePictureDto: UpdatePictureDto) {
  //   return `This action updates a #${id} picture`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} picture`;
  // }
}
