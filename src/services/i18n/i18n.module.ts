import { Module } from '@nestjs/common';
import { AcceptLanguageResolver, I18nModule as I18N } from 'nestjs-i18n';
import * as path from 'path';

@Module({
  imports: [
    I18N.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '..', '..', 'locales'),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
  ],
})
export class I18nModule {}
