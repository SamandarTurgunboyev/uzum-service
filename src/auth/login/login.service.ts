import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { OtpService } from 'src/otp/otp.service';
import { User } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';
import { jwtConstants } from '../constants';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class LoginService {
  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: Omit<AuthDto, 'firstName' | 'lastName'>) {
    const user = await this.userModel.findOne({ where: { phone: dto.phone } });
    const isMatch = await bcrypt.compare(dto.password, user?.password);
    if (!user) {
      throw new NotAcceptableException('User not found');
    }
    if (!isMatch) {
      throw new NotAcceptableException('Password is incorrect');
    }

    if (!user.isVerified) {
      await this.otpService.sendOtp(user.phone);
      return {
        message: 'Ro‘yxatdan o‘tdingiz. Telefon raqamga OTP yuborildi.',
        phone: user.phone,
      };
    }

    const payload = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      images: user.images,
      isVerified: user.isVerified,
      roles: user.roles,
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
