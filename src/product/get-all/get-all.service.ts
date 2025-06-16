import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'src/schemas/favorite';
import { Product } from 'src/schemas/product.schema';
import { Rating } from 'src/schemas/rating.schema';
import { lang_name } from 'src/utilits/name.utilits';
import { pages } from 'src/utilits/page.utilits';
import { Repository } from 'typeorm';

@Injectable()
export class GetAllService {
  constructor(
    @InjectRepository(Product)
    private readonly productModel: Repository<Product>,
    @InjectRepository(Favorite)
    private readonly favoriteModel: Repository<Favorite>,
    @InjectRepository(Rating)
    private readonly ratingModel: Repository<Rating>,
  ) {}

  async getAll(
    acceptLanguage: string,
    params: {
      page: string;
      page_size: string;
      min_price: string;
      max_price: string;
      brand: string;
      category: string;
    },
    userId?: number | undefined,
  ) {
    const { offset, page, pageSize } = pages(params);
    const [products, total] = await this.productModel.findAndCount({
      skip: offset,
      take: pageSize,
      order: { createdAt: 'DESC' },
      relations: ['brand', 'category'],
    });

    const { max_price, min_price, category, brand } = params;

    const data = await Promise.all(
      products.map(async (product) => {
        const { description, name } = lang_name(acceptLanguage, product);
        const rat = await this.ratingModel.find({
          where: { product: { id: product.id } },
        });
        let rating = 1;

        if (rat.length > 0) {
          const total_rating = rat.reduce(
            (acc, curr) => acc + Number(curr.rating),
            0,
          );
          rating = parseFloat((total_rating / rat.length).toFixed(1));
        }

        const fav = await this.favoriteModel.findOne({
          where: { user: { id: userId }, product: { id: product.id } },
        });

        return {
          id: product.id,
          name,
          description,
          price: product.price,
          disCount: product.disCount,
          disPrice: product.disPrice,
          banner: product.banner,
          media: product.media,
          isFavorite: fav ? true : false,
          createdAt: product.createdAt,
          updateAt: product.updateAt,
          brand: product.brand,
          category: product.category,
          rating,
        };
      }),
    );

    const res = data.filter((pro) => {
      const price = Number(pro.disCount ? pro.disPrice : pro.price);
      const min = Number(min_price);
      const max = Number(max_price);
      const priceFilter =
        (!min_price || price >= min) && (!max_price || price <= max);
      const brndFilter = !brand || pro.brand.id === Number(brand);
      const categoryFilter = !category || pro.category.id === Number(category);

      return priceFilter && brndFilter && categoryFilter;
    });

    return {
      total_pages: Math.ceil(total / pageSize),
      page,
      page_size: pageSize,
      next_page: page < Math.ceil(total / pageSize) ? true : false,
      prev_page: page > 1 ? true : false,
      data: res,
    };
  }
}
