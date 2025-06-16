import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userModel: Repository<User>,
  ) {}

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

  async editPasssword(
    userPayload: User,
    data: {
      old_password: string;
      new_password: string;
      password_confirm: string;
    },
  ) {
    const existingUser = await this.userModel.findOne({
      where: { phone: userPayload.phone },
    });

    if (!existingUser) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const old = await bcrypt.compare(data.old_password, existingUser.password);
    if (!old) {
      throw new BadRequestException('Parol xato kitildi');
    }

    if (data.new_password !== data.password_confirm) {
      throw new BadRequestException('Yangi parolni xato kiritingiz');
    }

    const hash = await bcrypt.hash(data.new_password, 10);
    existingUser.password = hash;
    await this.userModel.save(existingUser);

    return {
      message: "Parolingiz o'zgardi",
    };
  }
}
