import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private jwtService: JwtService
    ) { }

    async login(dto: Omit<AuthDto, "firstName" | "lastName">) {
        const user = await this.userModel.findOne({ phone: dto.phone })
        const isMatch = await bcrypt.compare(dto.password, user?.password);
        if (!user) {
            throw new BadRequestException("User not found")
        }
        if (!isMatch) {
            throw new BadRequestException("Password is incorrect")
        }
        const payload = { firstName: user.firstName, lastName: user.lastName, phone: user.phone };
        const access_token = await this.jwtService.signAsync(payload)
        const refreshToken = await this.jwtService.signAsync(payload, { secret: jwtConstants.refreshSecret, expiresIn: '7d' });

        return {
            user,
            access_token,
            refreshToken
        }
    }

    async register(dto: AuthDto) {
        const { password, phone, firstName, lastName } = dto
        const saltOrRounds = 10;
        const hash = await bcrypt.hash(password, saltOrRounds);
        const currentUser = await this.userModel.findOne({ phone })
        if (currentUser) {
            throw new NotFoundException(`User already exists`);
        }
        const user = await this.userModel.create({ firstName, lastName, password: hash, phone })
        const payload = { firstName: user.firstName, lastName: user.lastName, phone: user.phone };
        const access_token = await this.jwtService.signAsync(payload)
        const refreshToken = await this.jwtService.signAsync(payload, { secret: jwtConstants.refreshSecret, expiresIn: '7d' });


        return {
            user,
            access_token,
            refreshToken
        }
    }

    async refreshTokens(refreshToken: string) {
        try {
            // Refresh tokenni tekshirish (verify qilish)
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: jwtConstants.refreshSecret,
            });

            // Foydalanuvchini topish
            const user = await this.userModel.findOne({ phone: payload.phone });
            if (!user) {
                throw new BadRequestException("User not found");
            }

            // Yangi tokenlar uchun payload tayyorlash
            const userDto = { firstName: user.firstName, lastName: user.lastName, phone: user.phone };

            // Yangi access token va refresh token yaratish
            const newAccessToken = await this.jwtService.signAsync(userDto);
            const newRefreshToken = await this.jwtService.signAsync(userDto, { secret: jwtConstants.refreshSecret, expiresIn: '7d' });

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            };

        } catch (error) {
            throw new BadRequestException("Invalid refresh token");
        }
    }
}
