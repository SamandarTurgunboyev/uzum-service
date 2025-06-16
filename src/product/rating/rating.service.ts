import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/schemas/product.schema';
import { Rating } from 'src/schemas/rating.schema';
import { User } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
    @InjectRepository(Product)
    private readonly productModel: Repository<Product>,
    @InjectRepository(Rating)
    private readonly ratingModel: Repository<Rating>,
  ) {}

  async createRating(user: User, product: string, rating: string) {
    try {
      const existingUser = await this.userModel.findOne({
        where: { id: user.id },
      });

      if (!existingUser) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      const existingProduct = await this.productModel.findOne({
        where: { id: Number(product) },
      });

      if (!existingProduct) {
        throw new NotFoundException('Mahsulot topilmadi');
      }

      const existingRating = await this.ratingModel.findOne({
        where: { user: { id: user.id }, product: { id: Number(product) } },
      });

      if (existingRating) {
        throw new BadRequestException('Siz oldin bu mahsulotni baholagansiz');
      }

      const data = await this.ratingModel.create({
        rating: Number(rating),
        user: existingUser,
        product: existingProduct,
      });

      await this.ratingModel.save(data);

      return data;
    } catch (error) {
      throw new BadRequestException(error.message || 'Xatolik yuz berdi');
    }
  }
}
