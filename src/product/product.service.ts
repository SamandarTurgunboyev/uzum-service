import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';
import { Repository } from 'typeorm';
import { ProductDto } from './dto/dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productModel: Repository<Product>,
    @InjectRepository(User)
    private readonly userModel: Repository<User>,
  ) {}

  async createProduct(
    product: ProductDto,
    user: User,
    banners: Express.Multer.File[],
    medias: Express.Multer.File[],
  ) {
    const users = await this.userModel.findOne({
      where: { phone: user.phone },
      relations: ['store'],
    });

    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (!users?.store) {
      throw new NotFoundException("Sizda bunda huquq yo'q");
    }

    const bannerPaths = banners.map((file) => file.filename);
    const mediaPaths = medias.map((file) => file.filename);
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
    });

    await this.productModel.save(newProduct);
    return newProduct;
  }
  async getAll(acceptLanguage: string) {
    const products = await this.productModel.find();

    return products.map((product) => {
      let name: string;
      let description: string;

      switch (acceptLanguage) {
        case 'uz':
          name = product.name_uz;
          description = product.description_uz;
          break;
        case 'ru':
          name = product.name_ru;
          description = product.description_ru;
          break;
        case 'en':
          name = product.name_en;
          description = product.description_en;
          break;
        default:
          name = product.name_en;
          description = product.description_en;
      }

      return {
        id: product.id,
        name,
        description,
        price: product.price,
        disCount: product.disCount,
        disPrice: product.disPrice,
        banner: product.banner,
        media: product.media,
        createdAt: product.createdAt,
        updateAt: product.updateAt,
      };
    });
  }

  async getOneProduct(lang: string, id: string) {
    const product = await this.productModel.findOne({
      where: { id: Number(id) },
      relations: ['store'],
    });

    if (!product) {
      throw new NotFoundException('Mahsulot topilmadi');
    }

    let name: string;
    let description: string;

    switch (lang) {
      case 'uz':
        name = product.name_uz;
        description = product.description_uz;
        break;
      case 'ru':
        name = product.name_ru;
        description = product.description_ru;
        break;
      case 'en':
        name = product.name_en;
        description = product.description_en;
        break;
      default:
        name = product.name_en;
        description = product.description_en;
    }

    return {
      id: product.id,
      name,
      description,
      price: product.price,
      disCount: product.disCount,
      disPrice: product.disPrice,
      banner: product.banner,
      media: product.media,
      store: product.store,
      createdAt: product.createdAt,
      updateAt: product.updateAt,
    };
  }

  async getMyProduct(user: User, lang: string) {
    const existingUser = await this.userModel.findOne({
      where: { phone: user.phone },
      relations: ['store'],
    });

    if (!existingUser) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (!existingUser.store) {
      throw new NotFoundException('Siz sotuvchi emassiz');
    }

    const products = await this.productModel.find({
      where: { store: { id: existingUser.store.id } },
      relations: ['category'],
    });

    return products.map((product) => {
      let name: string;
      let description: string;

      switch (lang) {
        case 'uz':
          name = product.name_uz;
          description = product.description_uz;
          break;
        case 'ru':
          name = product.name_ru;
          description = product.description_ru;
          break;
        case 'en':
          name = product.name_en;
          description = product.description_en;
          break;
        default:
          name = product.name_en;
          description = product.description_en;
      }

      return {
        id: product.id,
        name,
        description,
        price: product.price,
        disCount: product.disCount,
        disPrice: product.disPrice,
        banner: product.banner,
        media: product.media,
        category: product.category,
        createdAt: product.createdAt,
        updateAt: product.updateAt,
      };
    });
  }

  async getProductsThisWeek(lang: string) {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const products = await this.productModel
      .createQueryBuilder('product')
      .where('product.createdAt >= :startOfMonth', { startOfMonth })
      .andWhere('product.createdAt <= :endOfMonth', { endOfMonth })
      .getMany();

    return products.map((product) => {
      let name: string;
      let description: string;

      switch (lang) {
        case 'uz':
          name = product.name_uz;
          description = product.description_uz;
          break;
        case 'ru':
          name = product.name_ru;
          description = product.description_ru;
          break;
        case 'en':
        default:
          name = product.name_en;
          description = product.description_en;
      }

      return {
        id: product.id,
        name,
        description,
        price: product.price,
        disCount: product.disCount,
        disPrice: product.disPrice,
        banner: product.banner,
        media: product.media,
        category: product.category,
        createdAt: product.createdAt,
        updateAt: product.updateAt,
      };
    });
  }

  async topDiscount(lang: string) {
    const products = await this.productModel.find();
    const disCountedProducts = products.filter((pro) => {
      const price = Number(pro.price.replace(/\./g, ''));
      const disPrice = Number(pro.disPrice?.replace(/\./g, ''));

      if (!price || !disPrice) return false; // xavfsizlik

      const discountPercent = ((price - disPrice) / price) * 100;

      return discountPercent >= 40;
    });

    return disCountedProducts.map((pro) => {
      const price = Number(pro.price.replace(/\./g, ''));
      const disPrice = Number(pro.disPrice?.replace(/\./g, ''));
      const discountPercent = ((price - disPrice) / price) * 100;

      let name: string;
      let description: string;

      switch (lang) {
        case 'uz':
          name = pro.name_uz;
          description = pro.description_uz;
          break;
        case 'ru':
          name = pro.name_ru;
          description = pro.description_ru;
          break;
        case 'en':
          name = pro.name_en;
          description = pro.description_en;
        default:
          name = pro.name_uz;
          description = pro.description_uz;
          break;
      }
      return {
        id: pro.id,
        name,
        description,
        price: pro.price,
        disCount: pro.disCount,
        disPrice: pro.disPrice,
        banner: pro.banner,
        media: pro.media,
        category: pro.category,
        discountPercent: Math.round(discountPercent).toString() + '%',
        createdAt: pro.createdAt,
        updateAt: pro.updateAt,
      };
    });
  }

  async discountedProduct(lang: string) {
    const products = await this.productModel.find();

    const disCounts = products.filter((pro) => pro.disCount === true);

    return disCounts.map((products) => {
      let name: string;
      let description: string;

      switch (lang) {
        case 'uz':
          name = products.name_uz;
          description = products.description_uz;
          break;
        case 'ru':
          name = products.name_ru;
          description = products.description_ru;
          break;
        case 'en':
          name = products.name_en;
          description = products.description_en;
          break;
        default:
          name = products.name_uz;
          description = products.description_uz;
          break;
      }
      return {
        id: products.id,
        name,
        description,
        price: products.price,
        disCount: products.disCount,
        disPrice: products.disPrice,
        banner: products.banner,
        media: products.media,
        category: products.category,
        createdAt: products.createdAt,
        updateAt: products.updateAt,
      };
    });
  }
}
