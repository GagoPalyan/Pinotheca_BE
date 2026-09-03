import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { MaterialEnum, PaintEnum, TypeEnum } from '../enums';

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
