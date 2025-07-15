import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name_uz: string;

  @IsNotEmpty()
  @IsString()
  name_ru: string;

  @IsNotEmpty()
  @IsString()
  name_en: string;

  @IsNotEmpty()
  @IsString()
  description_uz: string;

  @IsNotEmpty()
  @IsString()
  description_en: string;

  @IsNotEmpty()
  @IsString()
  description_ru: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsNotEmpty()
  @IsString()
  brandId: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  disCount: string;

  @IsOptional()
  @IsString()
  disPrice?: string;
}
