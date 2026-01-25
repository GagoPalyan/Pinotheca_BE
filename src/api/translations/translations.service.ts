import { Injectable, NotFoundException } from '@nestjs/common';
import { Language } from './dto/translation.dto';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class TranslationsService {
  private readonly defaultLang: Language = Language.EN;

  getTranslation(lang: Language): Record<string, any> {
    const filePath = this.getLocaleFilePath(lang);

    if (existsSync(filePath)) {
      const content = readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }

    const fallbackPath = this.getLocaleFilePath(this.defaultLang);
    if (existsSync(fallbackPath)) {
      const fallbackContent = readFileSync(fallbackPath, 'utf-8');
      return JSON.parse(fallbackContent);
    }

    throw new NotFoundException('Translation not found');
  }

  private getLocaleFilePath(lang: Language): string {
    return join(process.cwd(), 'src', 'locales', lang, 'frontend.json');
  }
}
