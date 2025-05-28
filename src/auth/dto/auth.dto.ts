import { IsNotEmpty, IsString, IsPhoneNumber, Matches } from 'class-validator';

export class AuthDto {
    @IsNotEmpty()
    firstName: string;

    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    password: string;
}
