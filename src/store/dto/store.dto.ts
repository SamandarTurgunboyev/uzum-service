import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StoreDto {
  @ApiProperty({ example: 'string' })
  @IsString()
  @IsNotEmpty()
  store_name: string;

  @ApiProperty({ example: 'string' })
  @IsNotEmpty()
  @IsString()
  latitude: string;

  @ApiProperty({ example: 'string' })
  @IsNotEmpty()
  @IsString()
  longitude: string;

  @ApiProperty({ example: 'string' })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    example: 'string',
    format: 'binary',
  })
  banner: any;
}
