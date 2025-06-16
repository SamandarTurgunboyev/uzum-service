import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'src/schemas/favorite';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';

@Injectable()
export class SaveService {
  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
    @InjectRepository(Product)
    private readonly productModel: Repository<Product>,
    @InjectRepository(Favorite)
    private readonly favoriteModel: Repository<Favorite>,
  ) {}

  async saveProduct(user: User, product: string) {
    const existingUser = await this.userModel.findOne({
      where: { id: user.id },
    });

    const existingProducts = await this.productModel.findOne({
      where: { slug: product },
    });

    if (!existingUser) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (!existingProducts) {
      throw new NotFoundException('Mahsulot topilmadi');
    }

    const existingFavourite = await this.favoriteModel.findOne({
      where: {
        user: { id: existingUser.id },
        product: { id: existingProducts.id },
      },
      relations: ['user', 'product'],
    });

    if (existingFavourite) {
      await this.favoriteModel.remove(existingFavourite);
      return { message: "Mahsulot o'chirildi" };
    } else {
      const fav = await this.favoriteModel.create({
        product: existingProducts,
        user: existingUser,
      });

      await this.favoriteModel.save(fav);

      return { message: 'Mahsulot saqlandi' };
    }
  }

  async getSaveProduct(user: User) {
    const existingUser = await this.userModel.findOne({
      where: { id: user.id },
    });

    if (!existingUser) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const data = await this.favoriteModel
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.product', 'product')
      .where('favorite.userId = :userId', { userId: user.id })
      .getMany();

    return data.map((fav) => fav.product);
  }
}
