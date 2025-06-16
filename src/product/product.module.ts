import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/schemas/brand.schema';
import { Favorite } from 'src/schemas/favorite';
import { Product } from 'src/schemas/product.schema';
import { Rating } from 'src/schemas/rating.schema';
import { subSubCategory } from 'src/schemas/subSubCategory.schema';
import { User } from 'src/schemas/user.schema';
import { BigDiscountController } from './big-discount/big-discount.controller';
import { BigDiscountService } from './big-discount/big-discount.service';
import { DeleteController } from './delete/delete.controller';
import { DeleteService } from './delete/delete.service';
import { DiscountedController } from './discounted/discounted.controller';
import { DiscountedService } from './discounted/discounted.service';
import { GetAllController } from './get-all/get-all.controller';
import { GetAllService } from './get-all/get-all.service';
import { GetOneController } from './get-one/get-one.controller';
import { GetOneService } from './get-one/get-one.service';
import { MonthlyController } from './monthly/monthly.controller';
import { MonthlyService } from './monthly/monthly.service';
import { MyProductController } from './my-product/my-product.controller';
import { MyProductService } from './my-product/my-product.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { RatingController } from './rating/rating.controller';
import { RatingService } from './rating/rating.service';
import { SaveController } from './save/save.controller';
import { SaveService } from './save/save.service';
import { UpdateController } from './update/update.controller';
import { UpdateService } from './update/update.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Product,
      Favorite,
      subSubCategory,
      Brand,
      Rating,
    ]),
  ],
  providers: [
    ProductService,
    GetAllService,
    MonthlyService,
    BigDiscountService,
    DiscountedService,
    MyProductService,
    SaveService,
    GetOneService,
    UpdateService,
    DeleteService,
    RatingService,
  ],
  controllers: [
    ProductController,
    GetAllController,
    MonthlyController,
    BigDiscountController,
    DiscountedController,
    MyProductController,
    SaveController,
    GetOneController,
    UpdateController,
    DeleteController,
    RatingController,
  ],
})
export class ProductModule {}
