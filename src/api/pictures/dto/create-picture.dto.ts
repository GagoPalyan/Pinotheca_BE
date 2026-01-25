import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export enum MaterialEnum {
  canvas = 'canvas',
  cardboard = 'cardboard',
  paper = 'paper',
  plywood = 'plywood',
}

export enum PaintEnum {
  oilPaint = 'oil paint',
  acrylic = 'acrylic',
  watercolor = 'water color',
  gouache = 'gouache',
  pencil = 'pencil',
  mixedMedia = 'mixed media',
  charcoal = 'charcoal',
  ink = 'ink',
}

export enum TypeEnum {
  vertical = 'vertical',
  horizontal = 'horizontal',
  square = 'square',
  round = 'round',
  oval = 'oval',
}

export class CreatePictureDto {
  @IsString()
  @IsNotEmpty()
  imageUrl: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  width: number;

  @IsNumber()
  @IsNotEmpty()
  height: number;

  @IsString()
  @IsNotEmpty()
  material: MaterialEnum;

  @IsString()
  @IsNotEmpty()
  paint: PaintEnum;

  @IsString()
  @IsNotEmpty()
  type: TypeEnum;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @IsOptional()
  @IsBoolean()
  isSold: boolean;

  @IsString()
  @IsNotEmpty()
  authorId: string;
}
