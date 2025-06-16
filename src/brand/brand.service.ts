import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role.enum';
import { Brand } from 'src/schemas/brand.schema';
import { User } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand) private readonly brandModel: Repository<Brand>,
    @InjectRepository(User) private readonly userModel: Repository<User>,
  ) {}

  async create(data: { name: string }, user: User) {
    try {
      const existingUser = await this.userModel.findOne({
        where: { id: user.id },
      });

      if (!existingUser) {
        throw new NotFoundException('Foydalanuvchi topilmdi');
      }

      if (existingUser.roles !== Role.SELLER) {
        throw new BadRequestException("Sizda bunday huquq yo'q");
      }

      const brand = await this.brandModel.create({
        name: data.name,
      });

      await this.brandModel.save(brand);

      return brand;
    } catch (error) {
      throw new BadRequestException(error?.message || 'Xatolik yuz berdi');
    }
  }

  async getBrand() {
    try {
      const data = await this.brandModel.find();

      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
