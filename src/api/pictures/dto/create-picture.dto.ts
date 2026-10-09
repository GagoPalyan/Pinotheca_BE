import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { MaterialEnum, PaintEnum, TypeEnum } from '../enums';

export class CreatePictureDto {
  @IsString()
  @IsNotEmpty()
  imageUrl!: string;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsNotEmpty()
  width!: number;

  @IsNumber()
  @IsNotEmpty()
  height!: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(MaterialEnum)
  material!: MaterialEnum;

  @IsString()
  @IsNotEmpty()
  @IsEnum(PaintEnum)
  paint!: PaintEnum;

  @IsString()
  @IsNotEmpty()
  @IsEnum(TypeEnum)
  type!: TypeEnum;

  @IsNumber()
  @IsNotEmpty()
  price!: number;

  @IsNumber()
  @IsNotEmpty()
  year!: number;

  @IsOptional()
  @IsBoolean()
  isSold!: boolean;

  @IsString()
  @IsNotEmpty()
  authorId!: string;
}
