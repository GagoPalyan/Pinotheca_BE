import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { MaterialEnum, PaintEnum, SortEnum, TypeEnum } from '../enums';
import { ToOptionalArray } from '../decorators/optional-array.decorator';

export class GetPictureQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  limit?: number;

  @ToOptionalArray()
  @IsEnum(MaterialEnum, { each: true })
  @IsOptional()
  material?: MaterialEnum[];

  @ToOptionalArray()
  @IsEnum(PaintEnum, { each: true })
  @IsOptional()
  paint?: PaintEnum[];

  @ToOptionalArray()
  @IsEnum(TypeEnum, { each: true })
  @IsOptional()
  type?: TypeEnum[];

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  priceMin?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  priceMax?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  widthMin?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  widthMax?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  heightMin?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  heightMax?: number;

  @IsOptional()
  @IsEnum(SortEnum)
  sort?: SortEnum;
}
