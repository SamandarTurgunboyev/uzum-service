import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from 'src/schemas/otp.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OtpService {
    constructor(@InjectModel(Otp.name) private otpModel: Model<OtpDocument>) { }

    async sendOtp(phone: string) {
        // Tekshirish: eski OTP mavjudmi va muddati o‘tmaganmi
        const existingOtp = await this.otpModel.findOne({ phone });

        // Yangi OTP generatsiya
        // const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const otpCode = "1111";
        const hash = await bcrypt.hash(otpCode, 10);

        await this.otpModel.create({
            phone,
            otp: hash
        });

        console.log(`Generated OTP for ${phone}: ${otpCode}`);
    }

    async verifyOtp(phone: string, otp: string) {
        const otpData = await this.otpModel.findOne({ phone });
        if (!otpData) throw new BadRequestException('OTP topilmadi');

        const isMatch = await bcrypt.compare(otp, otpData.otp);
        if (!isMatch) throw new BadRequestException('OTP noto‘g‘ri');

        await this.otpModel.deleteMany({ phone }); // Tekshirildi, endi o‘chirish
        return true;
    }
}
