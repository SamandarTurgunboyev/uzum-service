import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Otp } from 'src/schemas/otp.schema';
import { LessThan, Repository } from 'typeorm';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private otpRepository: Repository<Otp>,
  ) {}

  @Cron('*/1 * * * *')
  async handleOtpCleanup() {
    const expiredTime = new Date(Date.now() - 5 * 60 * 1000); // 5 daqiqa oldin
    const deleted = await this.otpRepository.delete({
      createdAt: LessThan(expiredTime),
    });
  }
  async sendOtp(phone: string) {
    await this.otpRepository.delete({ phone });

    const otpCode = '1111';
    const hash = await bcrypt.hash(otpCode, 10);

    const newOtp = await this.otpRepository.create({
      phone,
      otp: hash,
    });

    this.otpRepository.save(newOtp);
  }

  async verifyOtp(phone: string, otp: string) {
    const otpData = await this.otpRepository.findOne({ where: { phone } });
    if (!otpData) throw new BadRequestException('OTP topilmadi');

    const isMatch = await bcrypt.compare(otp, otpData.otp);
    if (!isMatch) throw new BadRequestException('OTP noto‘g‘ri');

    await this.otpRepository.delete({ phone });
    return true;
  }
}
