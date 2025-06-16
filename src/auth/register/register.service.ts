import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { OtpService } from 'src/otp/otp.service';
import { Role } from 'src/role.enum';
import { User } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
    private readonly otpService: OtpService,
  ) {}

  async register(dto: AuthDto) {
    const { password, phone, firstName, lastName } = dto;
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    const currentUser = await this.userModel.findOne({ where: { phone } });
    if (currentUser) {
      throw new NotFoundException(`User already exists`);
    }
    const newUser = this.userModel.create({
      firstName,
      lastName,
      password: hash,
      phone,
      roles: Role.User,
      isVerified: false,
    });

    await this.userModel.save(newUser);

    await this.otpService.sendOtp(phone);

    return {
      message: 'Ro‘yxatdan o‘tdingiz. Telefon raqamga OTP yuborildi.',
      phone,
    };
  }
}
