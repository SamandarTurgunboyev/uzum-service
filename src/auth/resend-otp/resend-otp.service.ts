import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpService } from 'src/otp/otp.service';
import { User } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';

@Injectable()
export class ResendOtpService {
  constructor(
    @InjectRepository(User)
    private userModel: Repository<User>,
    private otpService: OtpService,
  ) {}

  async resendOtp(phone: string) {
    const user = await this.userModel.findOne({ where: { phone } });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    if (user.isVerified) {
      return { message: 'Foydalanuvchi allaqachon tasdiqlangan' };
    }
    await this.otpService.sendOtp(phone);
    return { message: 'Yangi OTP yuborildi', phone };
  }
}
