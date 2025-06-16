import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';
import { AuthDto } from '../dto/auth.dto';

@Injectable()
export class UpdateService {
  constructor(
    @InjectRepository(User)
    private userModel: Repository<User>,
  ) {}

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

    if (file) {
      user.images = 'uploads/' + file.filename;
    }
    if (data.firstName) {
      user.firstName = data.firstName;
    }
    if (data.lastName) {
      user.lastName = data.lastName;
    }

    await this.userModel.save(user);
    return { message: 'Profil yangilandi', user };
  }
}
