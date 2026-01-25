import { Controller, Get, Param } from '@nestjs/common';
import { TranslationsService } from './translations.service';
import { GetLangParamDto } from './dto/translation.dto';

@Controller('translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get(':lang')
  getTranslation(@Param() params: GetLangParamDto) {
    return this.translationsService.getTranslation(params.lang);
  }
}
