import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { CountriesModule } from './countries/countries.module';
import DB from './data/db';
import { OtpModule } from './otp/otp.module';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';
import { SubCategoryModule } from './sub-category/sub-category.module';
import { SubSubCategoryModule } from './sub-sub-category/sub-sub-category.module';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DB,
    ScheduleModule.forRoot(),
    CountriesModule,
    AuthModule,
    OtpModule,
    ProductModule,
    StoreModule,
    CategoryModule,
    SubCategoryModule,
    SubSubCategoryModule,
    BrandModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
