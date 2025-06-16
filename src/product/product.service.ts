import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role.enum';
import { Brand } from 'src/schemas/brand.schema';
import { Product } from 'src/schemas/product.schema';
import { subSubCategory } from 'src/schemas/subSubCategory.schema';
import { User } from 'src/schemas/user.schema';
import { slugifyWithApostrophe } from 'src/utilits/slug.utilits';
import { slugify } from 'transliteration';
import { Repository } from 'typeorm';
import { ProductDto } from './dto/dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productModel: Repository<Product>,

    @InjectRepository(User)
    private readonly userModel: Repository<User>,

    @InjectRepository(subSubCategory)
    private readonly categoryModel: Repository<subSubCategory>,

    @InjectRepository(Brand)
    private readonly brandModel: Repository<Brand>,
  ) {}

  async createProduct(
    product: ProductDto,
    user: User,
    banners: Express.Multer.File[],
    medias: Express.Multer.File[],
  ) {
    try {
      const users = await this.userModel.findOne({
        where: { phone: user.phone },
        relations: ['store'],
      });

      if (!user) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      if (users?.roles !== Role.SELLER) {
        throw new BadRequestException("Sizda bunda huquq yo'q");
      }

      const existingCategory = await this.categoryModel.findOne({
        where: { id: Number(product.categoryId) },
      });

      if (!existingCategory) {
        throw new NotFoundException('Categoriya topilmadi');
      }

      const existingBrand = await this.brandModel.findOne({
        where: { id: Number(product.brandId) },
      });

      if (!existingBrand) {
        throw new NotFoundException('Categoriya topilmadi');
      }

      const bannerPaths = banners.map((file) => 'uploads/' + file.filename);
      const mediaPaths = medias.map((file) => 'uploads/' + file.filename);

      const newProduct = this.productModel.create({
        name_uz: product.name_uz,
        name_en: product.name_en,
        name_ru: product.name_ru,
        description_uz: product.description_uz,
        description_ru: product.description_ru,
        description_en: product.description_en,
        price: product.price,
        disCount: Boolean(product.disCount),
        disPrice: product.disPrice,
        banner: bannerPaths,
        media: mediaPaths,
        store: users.store,
        category: existingCategory,
        brand: existingBrand,
      });
      newProduct.slug = `${slugify(slugifyWithApostrophe(newProduct.name_uz))}-${newProduct.id}`;
      await this.productModel.save(newProduct);
      return newProduct;
    } catch (error) {
      throw new BadRequestException(error.message || 'Xatolik yuz berdi');
    }
  }
}
