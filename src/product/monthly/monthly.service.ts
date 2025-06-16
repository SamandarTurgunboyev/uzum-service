import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/schemas/product.schema';
import { lang_name } from 'src/utilits/name.utilits';
import { pages } from 'src/utilits/page.utilits';
import { Repository } from 'typeorm';

@Injectable()
export class MonthlyService {
  constructor(
    @InjectRepository(Product)
    private readonly productModel: Repository<Product>,
  ) {}

  async getProductsThisWeek(
    lang: string,
    query: { page: string; page_size: string },
  ) {
    const now = new Date();
    const { offset, page, pageSize } = pages(query);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    const [products, total] = await this.productModel
      .createQueryBuilder('product')
      .where('product.createdAt >= :startOfMonth', { startOfMonth })
      .andWhere('product.createdAt <= :endOfMonth', { endOfMonth })
      .orderBy('product.createdAt', 'DESC')
      .skip(offset)
      .take(pageSize)
      .getManyAndCount();

    const data = products.map((product) => {
      const { description, name } = lang_name(lang, products);
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
      prev_page: page > 1 ? true : false,
      data,
    };
  }
}
