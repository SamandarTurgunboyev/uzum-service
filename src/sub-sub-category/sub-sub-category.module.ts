import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from 'src/schemas/subCategory.schema';
import { subSubCategory } from 'src/schemas/subSubCategory.schema';
import { User } from 'src/schemas/user.schema';
import { SubSubCategoryController } from './sub-sub-category.controller';
import { SubSubCategoryService } from './sub-sub-category.service';

@Module({
  imports: [TypeOrmModule.forFeature([subSubCategory, User, SubCategory])],
  controllers: [SubSubCategoryController],
  providers: [SubSubCategoryService],
})
export class SubSubCategoryModule {}
