import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';

@Injectable()
export class DeleteService {
  constructor(
    @InjectRepository(Product)
    private readonly productModel: Repository<Product>,
    @InjectRepository(User)
    private readonly userModel: Repository<User>,
  ) {}
  async deleteProduct(id: string, user: User) {
    const existingUser = await this.userModel.findOne({
      where: { id: user.id },
      relations: ['store'],
    });

    if (!existingUser) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const existingProducts = await this.productModel.findOne({
      where: { slug: id },
      relations: ['store'],
    });

    if (!existingProducts) {
      throw new NotFoundException('Mahsulot topilmadi');
    }

    if (!existingUser.store) {
      throw new BadRequestException('Siz sotuvchi emassiz');
    }

    if (existingProducts.store.id !== existingUser.store.id) {
      throw new BadRequestException("Siz bu mahsulotni o'chira olmaysiz");
    }

    await this.productModel.remove(existingProducts);

    return { message: 'Mahsulot muvaffaqiyatli o‘chirildi' };
  }
}
