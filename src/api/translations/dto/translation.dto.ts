import { IsEnum } from 'class-validator';

export enum Language {
  EN = 'en',
  HY = 'hy',
  RU = 'ru',
}

export class GetLangParamDto {
  @IsEnum(Language, { message: 'lang must be one of: en, hy, ru' })
  lang: Language;
}
