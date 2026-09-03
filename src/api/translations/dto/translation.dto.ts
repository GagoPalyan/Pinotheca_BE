import { IsString } from 'class-validator';

enum Language {
  EN = 'en',
  HY = 'hy',
  RU = 'ru',
}

class GetLangParamDto {
  @IsString()
  lang: Language;
}

export { Language, GetLangParamDto };
