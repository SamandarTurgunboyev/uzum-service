import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';
import { ProductDto } from './dto/dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    acceptLanguage: string,
  ) {
    const newProduct = this.productModel.create({
      name: product.name,
      description: product.description,
      price: product.price,
      disCount: product.disCount,
      disPrice: product.disPrice,
      banner: banners,
      media: medias,
      user: user,
    });

    await this.productModel.save(newProduct);
    return newProduct;
  }

  async getAll(acceptLanguage: string) {
    return await this.productModel.find();
  }

  async getOneProduct(lang: string, id: string) {
    const product = await this.productModel.findOne({
      where: { id: Number(id) },
    });
    if (!product) {
      throw new NotFoundException('Mahsulot topilmadi');
    }

    return product;
  }
}
