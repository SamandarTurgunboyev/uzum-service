import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpService } from 'src/otp/otp.service';
import { User } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';
import { jwtConstants } from '../constants';

@Injectable()
export class RegisterConfirmService {
  constructor(
    @InjectRepository(User)
    private userModel: Repository<User>,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async confirmOtp(phone: string, otp: string) {
    const isValidOtp = await this.otpService.verifyOtp(phone, otp);
    if (!isValidOtp) {
      throw new BadRequestException('Noto‘g‘ri yoki muddati o‘tgan OTP');
    }

    const user = await this.userModel.findOne({ where: { phone } });
    if (!user) {
      throw new BadRequestException('Foydalanuvchi topilmadi');
    }
    user.isVerified = true;
    await this.userModel.save(user);

    const payload = {
      firstName: user?.firstName,
      lastName: user?.lastName,
      phone: user?.phone,
      images: user?.images,
      isVerified: user?.isVerified,
      roles: user?.roles,
    };

    const access_token = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: jwtConstants.refreshSecret,
      expiresIn: '7d',
    });

    return {
      access_token,
      refreshToken,
    };
  }
}
