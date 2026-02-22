import { IsEnum, IsString } from 'class-validator';

export enum Language {
  EN = 'en',
  HY = 'hy',
  RU = 'ru',
}

export class GetLangParamDto {
  @IsString()
  lang: Language;
}
