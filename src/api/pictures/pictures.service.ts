import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePictureDto } from './dto/create-picture.dto';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { I18nContext } from 'nestjs-i18n';
import type { GetPictureQueryDto } from './dto';
import type { IJwtPayload } from 'src/common/interfaces';
import { Request as ExpressRequest } from 'express';
import { UserInfoGateway } from 'src/socket/user-info/user-info.gateway';
import { CARD_IMAGE_SELECTOR } from './constants';

@Injectable()
export class PicturesService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userInfoGateway: UserInfoGateway,
  ) {}

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

  async findAll(req: ExpressRequest, query: GetPictureQueryDto) {
    const { search = '', page = 1, limit = 12 } = query;
    const skip = (page - 1) * limit;
    const userId = req?.user?.id || '';

    const dbCondition = userId
      ? {
          where: { userId },
          select: { id: true },
        }
      : false;

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
        select: {
          ...CARD_IMAGE_SELECTOR,
          author: {
            select: {
              id: true,
              firstname: true,
              lastname: true,
            },
          },
          likes: dbCondition,
          carts: dbCondition,
        },
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
    const data = pictures.map(({ likes, carts, ...picture }) => ({
      ...picture,
      isLiked: Boolean(likes?.length),
      isInCart: Boolean(carts?.length),
    }));

    return {
      data,
      meta: { total, page, limit, totalPages },
    };
  }

  async findOne(id: string) {
    const picture = await this.prismaService.picture.findUnique({
      where: { id },
      select: {
        ...CARD_IMAGE_SELECTOR,
        author: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            imageUrl: true,
            pictures: {
              where: { isSold: false, id: { not: id } },
              take: 3,
              select: CARD_IMAGE_SELECTOR,
            },
          },
        },
        isSold: true,
        material: true,
        paint: true,
        type: true,
        _count: {
          select: { likes: true, carts: true },
        },
      },
    });

    console.log('Picture details:', picture);

    return picture;
  }

  private async findPictureById(id: string, i18n: I18nContext) {
    const picture = await this.prismaService.picture.findUnique({
      where: { id },
    });

    if (!picture) throw new NotFoundException(i18n.t('backend.pictures.not_found'));

    return picture;
  }

  private getDbCondition(userId: string, pictureId: string) {
    return { userId, pictureId };
  }

  private async updateLikeCounts(userId: string) {
    if (!userId) return;

    const likesCount = await this.prismaService.like.count({
      where: { userId },
    });
    this.userInfoGateway.updateUserLikeCount(userId, likesCount);
  }

  async like(id: string, user: IJwtPayload, i18n: I18nContext) {
    await this.findPictureById(id, i18n);

    const userId = user.id;

    try {
      await this.prismaService.like.create({
        data: this.getDbCondition(userId, id),
      });

      this.updateLikeCounts(userId);

      return {
        liked: true,
        message: i18n.t('backend.pictures.liked'),
      };
    } catch (error) {
      await this.prismaService.like.delete({
        where: { userId_pictureId: this.getDbCondition(userId, id) },
      });

      this.updateLikeCounts(userId);

      return {
        liked: false,
        message: i18n.t('backend.pictures.unliked'),
      };
    }
  }

  private async updateCartCounts(userId: string) {
    if (!userId) return;

    const cartCount = await this.prismaService.cart.count({
      where: { userId },
    });
    this.userInfoGateway.updateUserCartCount(userId, cartCount);
  }

  async cart(id: string, user: IJwtPayload, i18n: I18nContext) {
    await this.findPictureById(id, i18n);

    const userId = user.id;

    try {
      await this.prismaService.cart.create({
        data: this.getDbCondition(userId, id),
      });

      this.updateCartCounts(userId);

      return {
        isInCart: true,
        message: i18n.t('backend.pictures.added_in_cart'),
      };
    } catch (error) {
      await this.prismaService.cart.delete({
        where: { userId_pictureId: this.getDbCondition(userId, id) },
      });

      this.updateCartCounts(userId);

      return {
        isInCart: false,
        message: i18n.t('backend.pictures.removed_from_cart'),
      };
    }
  }

  // update(id: number, updatePictureDto: UpdatePictureDto) {
  //   return `This action updates a #${id} picture`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} picture`;
  // }
}
