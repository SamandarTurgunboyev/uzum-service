import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Product])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
