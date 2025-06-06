import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  price: string;

  @IsOptional()
  @IsBoolean()
  disCount?: boolean;

  @IsOptional()
  @IsString()
  disPrice?: string;
}
