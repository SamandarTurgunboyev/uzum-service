import { ArgumentMetadata, BadRequestException, Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { OtpService } from 'src/otp/otp.service';
import { Role } from 'src/role.enum';

@Injectable()
export class AuthService implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        // "value" is an object containing the file's attributes and metadata
        const oneKb = 5000;
        return value.size < oneKb;
    }

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private jwtService: JwtService,
        private otpService: OtpService
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

        if (!user.isVerified) {
            await this.otpService.sendOtp(user.phone);
            return { message: 'Ro‘yxatdan o‘tdingiz. Telefon raqamga OTP yuborildi.', phone: user.phone };
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
        await this.userModel.create({ firstName, lastName, password: hash, phone, roles: Role.User })
        await this.otpService.sendOtp(phone);

        return { message: 'Ro‘yxatdan o‘tdingiz. Telefon raqamga OTP yuborildi.', phone };
    }

    async confirmOtp(phone: string, otp: string) {
        const isValidOtp = await this.otpService.verifyOtp(phone, otp);
        if (!isValidOtp) {
            throw new BadRequestException('Noto‘g‘ri yoki muddati o‘tgan OTP');
        }

        const user = await this.userModel.findOne({ phone })
        const payload = { firstName: user?.firstName, lastName: user?.lastName, phone: user?.phone };
        const access_token = await this.jwtService.signAsync(payload)
        const refreshToken = await this.jwtService.signAsync(payload, { secret: jwtConstants.refreshSecret, expiresIn: '7d' });
        // Update user as verified
        await this.userModel.findOneAndUpdate({ phone }, { isVerified: true }, { new: true });

        return {
            user,
            access_token,
            refreshToken
        };
    }

    async resendOtp(phone: string) {
        const user = await this.userModel.findOne({ phone });
        if (!user) {
            throw new NotFoundException('Foydalanuvchi topilmadi');
        }
        if (user.isVerified) {
            return { message: 'Foydalanuvchi allaqachon tasdiqlangan' };
        }
        await this.otpService.sendOtp(phone);
        return { message: 'Yangi OTP yuborildi', phone };
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

    async editAccount(file: Express.Multer.File, data: Partial<AuthDto>, userPayload: any) {
        const user = await this.userModel.findOne({ phone: userPayload.phone });
        if (!user) {
            throw new NotFoundException('Foydalanuvchi topilmadi');
        }

        user.images = "uploads/" + file.filename;
        user.firstName = data.firstName || user.firstName;
        user.lastName = data.lastName || user.lastName;

        await user.save();
        return { message: 'Profil yangilandi', user };
    }
}
