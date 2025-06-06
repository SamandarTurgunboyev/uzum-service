import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthDto {
    @ApiProperty({ example: 'string', description: 'Foydalanuvchi telefon raqami' })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ example: 'string', description: 'Foydalanuvchi paroli' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'string', description: 'Foydalanuvchi ismi' })
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'string', description: 'Foydalanuvchi familiyasi' })
    @IsString()
    lastName: string;
}
