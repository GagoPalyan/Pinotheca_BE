import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';
import handlebars from 'handlebars';
import { ConfigService } from '@nestjs/config';
import { getNodeMailerConfig } from 'src/config/nodemailer.config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly ConfigService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: getNodeMailerConfig(this.ConfigService),
    });
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

    const info = await this.transporter.sendMail({
      from: getNodeMailerConfig(this.ConfigService).user,
      to,
      subject: 'Your Magic Register Link',
      html,
    });

    return info;
  }
}
