import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';
import { getNodeMailerConfig } from 'src/config/nodemailer.config';
import { INodeMailerConfig } from './interfaces/configs.interfaces';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private readonly configs: INodeMailerConfig;

  constructor(private readonly ConfigService: ConfigService) {
    this.configs = getNodeMailerConfig(this.ConfigService);
    this.transporter = nodemailer.createTransport(this.configs);
  }

  private compileTemplate(templateName: string, url: string): string {
    const templatePath = path.join(
      process.cwd(),
      'src',
      'common',
      'email',
      'templates',
      `${templateName}.hbs`,
    );
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    return template({ url });
  }

  async sendMagicLinkEmail(to: string, url: string) {
    const html = this.compileTemplate('magic-link', url);

    await this.transporter.sendMail({
      from: this.configs.auth.user,
      to,
      subject: 'Your Magic Register Link',
      html,
    });
  }

  async sendForgotPasswordEmail(to: string, url: string) {
    const html = this.compileTemplate('forgot-password', url);

    await this.transporter.sendMail({
      from: this.configs.auth.user,
      to,
      subject: 'Your Forgot Password Link',
      html,
    });
  }
}
