import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/schemas/product.schema';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
