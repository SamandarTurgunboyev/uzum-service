import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';
import { lang_name } from 'src/utilits/name.utilits';
import { pages } from 'src/utilits/page.utilits';
import { Repository } from 'typeorm';

@Injectable()
export class MyProductService {
  constructor(
    @InjectRepository(User)
    private readonly userModel: Repository<User>,
    @InjectRepository(Product)
    private readonly productModel: Repository<Product>,
  ) {}

  async getMyProduct(
    user: User,
    lang: string,
    query: { page: string; page_size: string },
  ) {
    const { offset, page, pageSize } = pages(query);

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

    const [products, total] = await this.productModel.findAndCount({
      where: { store: { id: existingUser.store.id } },
      relations: ['category'],
      skip: offset,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });

    const data = products.map((product) => {
      const { description, name } = lang_name(lang, product);
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

    return {
      total_pages: Math.ceil(total / pageSize),
      page_size: pageSize,
      page,
      next_page: page < Math.ceil(total / pageSize) ? true : false,
      prev_next: page > 1 ? true : false,
      data,
    };
  }
}
