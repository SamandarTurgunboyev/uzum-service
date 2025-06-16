import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/schemas/product.schema';
import { lang_name } from 'src/utilits/name.utilits';
import { pages } from 'src/utilits/page.utilits';
import { Repository } from 'typeorm';

@Injectable()
export class DiscountedService {
  constructor(
    @InjectRepository(Product)
    private readonly productModel: Repository<Product>,
  ) {}

  async discountedProduct(
    lang: string,
    query: { page: string; page_size: string },
  ) {
    const { offset, page, pageSize } = pages(query);
    const [products, total] = await this.productModel.findAndCount({
      where: { disCount: true },
      skip: offset,
      take: pageSize,
    });

    const data = products.map((products) => {
      const { description, name } = lang_name(lang, products);
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
    return {
      total_pages: Math.ceil(total / pageSize),
      page,
      page_size: pageSize,
      next_page: page < Math.ceil(total / pageSize) ? true : false,
      prev_page: page < 1 ? true : false,
      data,
    };
  }
}
