import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'src/schemas/favorite';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';
import { slugifyWithApostrophe } from 'src/utilits/slug.utilits';
import { slugify } from 'transliteration';
import { Repository } from 'typeorm';
import { ProductDto } from '../dto/dto';

@Injectable()
export class UpdateService {
  constructor(
    @InjectRepository(Product)
    private readonly productModel: Repository<Product>,
    @InjectRepository(User)
    private readonly userModel: Repository<User>,
    @InjectRepository(Favorite)
    private readonly favoriteModel: Repository<Favorite>,
  ) {}

  async updateProduct(
    id: string,
    user: User,
    product: ProductDto,
    banners: Express.Multer.File[],
    medias: Express.Multer.File[],
  ) {
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
      throw new BadRequestException("Siz bu mahsulotni o'zgartira olmaysiz");
    }
    const bannerPaths = banners.map((file) => file.filename);
    const mediaPaths = medias.map((file) => file.filename);

    existingProducts.name_uz = product.name_uz || existingProducts.name_uz;
    existingProducts.name_en = product.name_en || existingProducts.name_en;
    existingProducts.name_ru = product.name_ru || existingProducts.name_ru;
    existingProducts.description_ru =
      product.description_ru || existingProducts.description_ru;
    existingProducts.description_uz =
      product.description_uz || existingProducts.description_uz;
    existingProducts.description_en =
      product.description_en || existingProducts.description_en;
    existingProducts.disCount = product.disCount || existingProducts.disCount;
    existingProducts.disPrice = product.disPrice || existingProducts.disPrice;
    existingProducts.price = product.price || existingProducts.price;
    existingProducts.banner = [
      ...(existingProducts.banner || []),
      ...bannerPaths,
    ];
    existingProducts.media = [...(existingProducts.media || []), ...mediaPaths];
    existingProducts.slug = `${slugify(slugifyWithApostrophe(existingProducts.name_uz))}-${existingProducts.id}`;

    // existingProducts.category =product.
    await this.productModel.save(existingProducts);

    return {
      id: existingProducts.id,
      slug: existingProducts.slug,
      name_uz: existingProducts.name_uz,
      name_en: existingProducts.name_en,
      name_ru: existingProducts.name_ru,
      description_uz: existingProducts.description_uz,
      description_ru: existingProducts.description_ru,
      description_en: existingProducts.description_en,
      price: existingProducts.price,
      disCount: Boolean(existingProducts.disCount),
      disPrice: existingProducts.disPrice,
      banner: existingProducts.banner,
      media: existingProducts.media,
    };
  }
}
