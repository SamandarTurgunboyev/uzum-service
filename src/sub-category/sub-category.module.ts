import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/schemas/category.schema';
import { SubCategory } from 'src/schemas/subCategory.schema';
import { User } from 'src/schemas/user.schema';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategory, Category, User])],
  providers: [SubCategoryService],
  controllers: [SubCategoryController],
})
export class SubCategoryModule {}
