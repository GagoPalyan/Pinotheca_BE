import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { MagicLinkDto, RegisterEmailDto } from './dto/register.dto';
import type { ResetPasswordDto } from './dto/reset.dto';
import type { LoginDto } from './dto/login.dto';
import type Redis from 'ioredis';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/common/email/email.service';
import { IJwtPayload } from './interfaces/jwt.interfaces';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { isDev } from 'src/utils/is-dev.utils';
import { parseDuration } from 'src/utils/parse-duration.utils';
import { getClientUrl } from 'src/utils/get-client-url.utils';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  private readonly CLIENT_URL: string;
  private readonly COOKIE_DOMAIN: string;
  private readonly JWT_ACCESS_TOKEN_TTL: string;
  private readonly JWT_REFRESH_TOKEN_TTL: string;

  constructor(
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly PrismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
  ) {
    this.CLIENT_URL = getClientUrl(this.configService);
    this.COOKIE_DOMAIN = this.configService.getOrThrow<string>('COOKIE_DOMAIN');
    this.JWT_ACCESS_TOKEN_TTL = this.configService.getOrThrow<string>('JWT_ACCESS_TOKEN_TTL');
    this.JWT_REFRESH_TOKEN_TTL = this.configService.getOrThrow<string>('JWT_REFRESH_TOKEN_TTL');
  }

  async register(dto: RegisterEmailDto, i18n: I18nContext) {
    const user = await this.PrismaService.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });

    if (user)
      throw new ConflictException(
        i18n.t('backend.auth.user_already_exist', { args: { email: dto.email } }),
      );

    const token = crypto.randomBytes(32).toString('hex');
    const hashToken = crypto.createHash('sha256').update(token).digest('hex');

    const key = `magic_link:${hashToken}`;
    await this.redis.set(key, dto.email, 'EX', 900);

    const link = `${this.CLIENT_URL}/magic-link?token=${token}`;

    this.emailService.sendMagicLinkEmail(dto.email, link);

    return {
      message: i18n.t('backend.auth.register', { args: { email: dto.email } }),
      status: 201,
    };
  }

  async magicLink(res: Response, dto: MagicLinkDto, i18n: I18nContext) {
    const { token, firstname, lastname, password } = dto;

    const hashToken = crypto.createHash('sha256').update(token).digest('hex');
    const email = await this.redis.getdel(`magic_link:${hashToken}`);

    if (!email) throw new ConflictException(i18n.t('backend.auth.invalid_token'));

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.PrismaService.user.create({
      data: {
        email,
        firstname,
        lastname,
        password: hashedPassword,
      },
    });

    return this.auth(res, user.id);
  }

  async login(res: Response, dto: LoginDto, i18n: I18nContext) {
    const user = await this.PrismaService.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) throw new UnauthorizedException(i18n.t('backend.auth.invalid_credentials'));

    const isValid = await bcrypt.compare(dto.password, user.password);

    if (!isValid) throw new UnauthorizedException(i18n.t('backend.auth.invalid_credentials'));

    return this.auth(res, user.id);
  }

  async forgotPassword(dto: RegisterEmailDto, i18n: I18nContext) {
    const user = await this.PrismaService.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
      },
    });

    if (!user)
      throw new ConflictException(
        i18n.t('backend.auth.invalid_credentials', { args: { email: dto.email } }),
      );

    const token = crypto.randomBytes(32).toString('hex');
    const hashToken = crypto.createHash('sha256').update(token).digest('hex');

    const key = `forgot_password:${hashToken}`;
    await this.redis.set(key, user.id, 'EX', 900);

    const link = `${this.CLIENT_URL}/reset-password?token=${token}`;

    this.emailService.sendForgotPasswordEmail(dto.email, link);

    return {
      message: i18n.t('backend.auth.forgot_password', { args: { email: dto.email } }),
      status: 201,
    };
  }

  async resetPassword(res: Response, dto: ResetPasswordDto, i18n: I18nContext) {
    const hashToken = crypto.createHash('sha256').update(dto.token).digest('hex');
    const userId = await this.redis.getdel(`forgot_password:${hashToken}`);

    if (!userId) throw new ConflictException(i18n.t('backend.auth.invalid_token'));

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    await this.PrismaService.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return this.auth(res, userId);
  }

  async refresh(req: Request, res: Response, i18n: I18nContext) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) throw new UnauthorizedException(i18n.t('backend.auth.unauthorized'));

    const payload: IJwtPayload = await this.jwtService.verifyAsync<IJwtPayload>(refreshToken);

    const user = await this.PrismaService.user.findUnique({
      where: {
        id: payload.id,
      },
      select: {
        id: true,
      },
    });

    if (!user) throw new UnauthorizedException(i18n.t('backend.auth.unauthorized'));

    return this.auth(res, user.id);
  }

  private async auth(res: Response, id: string) {
    const { accessToken, refreshToken } = await this.generateTokens(id);

    this.setCookie(
      res,
      refreshToken,
      new Date(Date.now() + parseDuration(this.JWT_REFRESH_TOKEN_TTL)),
    );

    return { accessToken };
  }

  private async generateTokens(id: string) {
    const payload: IJwtPayload = { id };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_ACCESS_TOKEN_TTL,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: this.JWT_REFRESH_TOKEN_TTL,
    });

    return { accessToken, refreshToken };
  }

  private setCookie(res: Response, value: string, expires: Date) {
    res.cookie('refreshToken', value, {
      httpOnly: true,
      domain: this.COOKIE_DOMAIN,
      expires,
      secure: !isDev(this.configService),
      sameSite: isDev(this.configService) ? 'lax' : 'none',
    });
  }
}
