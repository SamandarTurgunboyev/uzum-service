import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'src/schemas/favorite';
import { Product } from 'src/schemas/product.schema';
import { Rating } from 'src/schemas/rating.schema';
import { User } from 'src/schemas/user.schema';
import { lang_name } from 'src/utilits/name.utilits';
import { pages } from 'src/utilits/page.utilits';
import { Repository } from 'typeorm';

@Injectable()
export class SaveService {
  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
    @InjectRepository(Product)
    private readonly productModel: Repository<Product>,
    @InjectRepository(Favorite)
    private readonly favoriteModel: Repository<Favorite>,
    @InjectRepository(Rating)
    private readonly ratingModel: Repository<Rating>,
  ) {}

  async saveProduct(user: User, product: string) {
    const existingUser = await this.userModel.findOne({
      where: { id: user.id },
    });

    const existingProducts = await this.productModel.findOne({
      where: { slug: product },
    });

    if (!existingUser) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (!existingProducts) {
      throw new NotFoundException('Mahsulot topilmadi');
    }

    const existingFavourite = await this.favoriteModel.findOne({
      where: {
        user: { id: existingUser.id },
        product: { id: existingProducts.id },
      },
      relations: ['user', 'product'],
    });

    if (existingFavourite) {
      await this.favoriteModel.remove(existingFavourite);
      return { message: "Mahsulot o'chirildi" };
    } else {
      const fav = await this.favoriteModel.create({
        product: existingProducts,
        user: existingUser,
      });

      await this.favoriteModel.save(fav);

      return { message: 'Mahsulot saqlandi' };
    }
  }

  async getSaveProduct(
    user: User,
    acceptLanguage: string,
    params: {
      page: string;
      page_size: string;
    },
  ) {
    const existingUser = await this.userModel.findOne({
      where: { id: user.id },
    });

    const { offset, page, pageSize } = pages(params);

    if (!existingUser) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const [data, total] = await this.favoriteModel.findAndCount({
      where: { user: { id: user.id } },
      relations: ['product'],
      skip: offset,
      take: pageSize,
    });

    const products = data.map((fav) => fav.product);

    const products_lang = await Promise.all(
      products.map(async (product) => {
        const { name, description } = lang_name(acceptLanguage, product);
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
          where: { user: { id: user.id }, product: { id: product.id } },
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
          slug: product.slug,
          rating,
        };
      }),
    );

    return {
      total_pages: Math.ceil(total / pageSize),
      page,
      page_size: pageSize,
      next_page: page < Math.ceil(total / pageSize),
      prev_page: page > 1,
      data: products_lang,
    };
  }
}
