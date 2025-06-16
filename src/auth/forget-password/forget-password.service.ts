import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { OtpService } from 'src/otp/otp.service';
import { User } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';
import { jwtConstants } from '../constants';

@Injectable()
export class ForgetPasswordService {
  constructor(
    @InjectRepository(User)
    private userModel: Repository<User>,
    private otpService: OtpService,
    private jwtService: JwtService,
  ) {}

  async forgetPassword(phone: string) {
    const user = await this.userModel.findOne({ where: { phone } });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    await this.otpService.sendOtp(phone);
    return {
      message: 'otp yuborildi',
    };
  }

  async forgetPasswordConfirm(phone: string, otp: string) {
    const isVerify = await this.otpService.verifyOtp(phone, otp);
    if (!isVerify) {
      throw new BadRequestException('Otp kod eskirgan');
    }

    const user = await this.userModel.findOne({ where: { phone } });
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

  async newPassword(
    token: string,
    new_password: string,
    password_confirm: string,
  ) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: jwtConstants.secret,
    });

    if (!payload) {
      throw new NotFoundException('Foydalanuvch topilmadi');
    }

    const user = await this.userModel.findOne({
      where: { phone: payload.phone },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (new_password != password_confirm) {
      throw new BadRequestException("Parolni to'g'ri kiriting");
    }

    const salt = 10;
    const hash = await bcrypt.hash(new_password, salt);
    const update = await this.userModel.findOne({
      where: { phone: payload.phone },
    });

    if (!update) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }
    update.password = hash;
    await this.userModel.save(update);

    const userDto = {
      firstName: update?.firstName,
      lastName: update?.lastName,
      phone: update?.phone,
      images: update?.images,
      isVerified: update?.isVerified,
      roles: update?.roles,
    };

    const newAccessToken = await this.jwtService.signAsync(userDto);
    const newRefreshToken = await this.jwtService.signAsync(userDto, {
      secret: jwtConstants.refreshSecret,
      expiresIn: '7d',
    });

    return {
      user: userDto,
      access_token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
