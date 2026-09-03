import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { MaterialEnum, PaintEnum, SortEnum, TypeEnum } from '../enums';

const toOptionalArray = ({ value }: { value: unknown }) => {
  if (value === undefined || value === null || value === '') return undefined;
  return Array.isArray(value) ? value : [value];
};

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

  @IsOptional()
  @Transform(toOptionalArray)
  @IsEnum(MaterialEnum, { each: true })
  material?: MaterialEnum[];

  @IsOptional()
  @Transform(toOptionalArray)
  @IsEnum(PaintEnum, { each: true })
  paint?: PaintEnum[];

  @IsOptional()
  @Transform(toOptionalArray)
  @IsEnum(TypeEnum, { each: true })
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
