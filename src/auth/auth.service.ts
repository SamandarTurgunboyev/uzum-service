import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { OtpService } from 'src/otp/otp.service';
import { Role } from 'src/role.enum';
import { User } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';
import { jwtConstants } from './constants';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const oneKb = 5000;
    return value.size < oneKb;
  }

  constructor(
    @InjectRepository(User)
    private userModel: Repository<User>,
    private jwtService: JwtService,
    private otpService: OtpService,
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
      user: payload,
      access_token,
      refreshToken,
    };
  }

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
      user: payload,
      access_token,
      refreshToken,
    };
  }

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

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.refreshSecret,
      });
      const user = await this.userModel.findOne({
        where: { phone: payload.phone },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const userDto = {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        images: user.images,
        isVerified: user.isVerified,
        roles: user.roles,
      };

      const newAccessToken = await this.jwtService.signAsync(userDto);
      const newRefreshToken = await this.jwtService.signAsync(userDto, {
        secret: jwtConstants.refreshSecret,
        expiresIn: '7d',
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new BadRequestException('Invalid refresh token');
    }
  }

  async editAccount(
    file: Express.Multer.File,
    data: Partial<AuthDto>,
    userPayload: any,
  ) {
    const user = await this.userModel.findOne({
      where: { phone: userPayload.phone },
    });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    user.images = 'uploads/' + file.filename;
    user.firstName = data.firstName || user.firstName;
    user.lastName = data.lastName || user.lastName;

    await this.userModel.save(user);
    return { message: 'Profil yangilandi', user };
  }

  async myProfile(user) {
    const users = await this.userModel.findOne({
      where: { phone: user.phone },
      relations: ['store'],
    });
    if (!users) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const payload = {
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      phone: users.phone,
      images: users.images,
      isVerified: users.isVerified,
      roles: users.roles,
      store: users.store,
    };

    return {
      data: payload,
    };
  }

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
