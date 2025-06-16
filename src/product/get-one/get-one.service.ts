import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Favorite } from 'src/schemas/favorite';
import { Product } from 'src/schemas/product.schema';
import { Rating } from 'src/schemas/rating.schema';
import { User } from 'src/schemas/user.schema';
import { lang_name } from 'src/utilits/name.utilits';
import { Repository } from 'typeorm';

@Injectable()
export class GetOneService {
  constructor(
    @InjectRepository(Product)
    private readonly productModel: Repository<Product>,
    @InjectRepository(User)
    private readonly userModel: Repository<User>,
    @InjectRepository(Rating)
    private readonly ratingModel: Repository<Rating>,
    @InjectRepository(Favorite)
    private readonly favModel: Repository<Favorite>,
  ) {}

  async getOneProduct(lang: string, slug: string, user: User) {
    let myRating;
    let rating = 1;
    let isfavourite;
    const users = await this.userModel.findOne({ where: { id: user.id } });
    const product = await this.productModel.findOne({
      where: { slug },
      relations: [
        'store',
        'category',
        'brand',
        'category.subCategory',
        'category.subCategory.category',
      ],
    });

    if (users) {
      const myRatings = await this.ratingModel.findOne({
        where: { user: { id: users.id }, product: { slug: slug } },
      });

      myRating = myRatings?.rating || 1;

      const ratings = await this.ratingModel.find({
        where: { product: { slug: slug } },
      });

      if (ratings.length > 0) {
        const total = ratings.reduce(
          (acc, curr) => acc + Number(curr.rating),
          0,
        );
        rating = parseFloat((total / ratings.length).toFixed(1));
      }

      const fav = await this.favModel.findOne({
        where: { user: { id: users.id }, product: { slug: slug } },
      });

      isfavourite = fav ? true : false;
    }

    if (!product) {
      throw new NotFoundException('Mahsulot topilmadi');
    }

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
      store: product.store,
      createdAt: product.createdAt,
      updateAt: product.updateAt,
      category: product.category,
      brand: product.brand,
      myRating,
      isfavourite,
      rating,
    };
  }
}
