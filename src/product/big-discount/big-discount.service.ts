import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/schemas/product.schema';
import { lang_name } from 'src/utilits/name.utilits';
import { pages } from 'src/utilits/page.utilits';
import { Repository } from 'typeorm';

@Injectable()
export class BigDiscountService {
  constructor(
    @InjectRepository(Product)
    private readonly productModel: Repository<Product>,
  ) {}

  async topDiscount(lang: string, query: { page: string; page_size: string }) {
    const { offset, page, pageSize } = pages(query);
    const [products, total] = await this.productModel
      .createQueryBuilder('product')
      .where('product.disCount = :disCount', { disCount: true })
      .andWhere(
        `(
              (CAST(REPLACE(product.price, '.', '') AS numeric) - CAST(REPLACE(product.disPrice, '.', '') AS numeric))
              / CAST(REPLACE(product.price, '.', '') AS numeric)
            ) * 100 >= :minDiscount`,
        { minDiscount: 40 },
      )
      .skip(offset)
      .take(pageSize)
      .getManyAndCount();

    const data = products.map((pro) => {
      const { description, name } = lang_name(lang, pro);
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
        createdAt: pro.createdAt,
        updateAt: pro.updateAt,
      };
    });

    return {
      total_pages: Math.ceil(total / pageSize),
      page,
      page_size: pageSize,
      next_page: page < Math.ceil(total / pageSize) ? true : false,
      prev_page: page > 1 ? true : false,
      data,
    };
  }
}
