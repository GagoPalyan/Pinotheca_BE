import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { MagicLinkDto, RegisterEmailDto } from './dto/register.dto';
import type Redis from 'ioredis';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/common/email/email.service';

@Injectable()
export class AuthService {
  private readonly clientUrl: string;

  constructor(
    private readonly PrismaService: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {
    this.clientUrl = this.configService.getOrThrow<string>('CLIENT_URL');
  }

  async register(dto: RegisterEmailDto) {
    const user = await this.PrismaService.user.findUnique({
      where: {
        email: dto.email,
      },
      select: {
        id: true,
      },
    });

    if (user) throw new UnauthorizedException('User already exists');

    const token = crypto.randomBytes(32).toString('hex');
    const hashToken = crypto.createHash('sha256').update(token).digest('hex');

    const key = `magic_link:${hashToken}`;
    await this.redis.set(key, dto.email, 'EX', 900);

    const link = `${this.clientUrl}/magic-link?token=${token}`;

    this.emailService.sendMagicLinkEmail(dto.email, link);

    return 'Please check your email';
  }

  async magicLink(dto: MagicLinkDto) {
    const { token, firstname, lastname, password } = dto;

    const hashToken = crypto.createHash('sha256').update(token).digest('hex');
    const email = await this.redis.getdel(`magic_link:${hashToken}`);

    if (!email) throw new UnauthorizedException('Invalid token');

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.PrismaService.user.create({
      data: {
        email,
        firstname,
        lastname,
        password: hashedPassword,
      },
    });

    return {
      message: 'User created successfully',
    };
  }
}
