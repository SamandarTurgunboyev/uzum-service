import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from "bcrypt"
import { OtpService } from 'src/otp/otp.service';
import { User, UserDocument } from 'src/schemas/user.schema';
import { jwtConstants } from 'src/auth/constants';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
        private readonly otpService: OtpService
    ) { }

    async loginAdmin(data: { phone: string, password: string }) {
        const user = await this.userModel.findOne({ phone: data.phone })
        const isMatch = await bcrypt.compare(data.password, user?.password);
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
}
