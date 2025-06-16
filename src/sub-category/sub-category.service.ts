import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role.enum';
import { Category } from 'src/schemas/category.schema';
import { SubCategory } from 'src/schemas/subCategory.schema';
import { User } from 'src/schemas/user.schema';
import { slugifyWithApostrophe } from 'src/utilits/slug.utilits';
import { Repository } from 'typeorm';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectRepository(User) private readonly userModel: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryModel: Repository<Category>,
    @InjectRepository(SubCategory)
    private readonly subCategoryModel: Repository<SubCategory>,
  ) {}

  async createCategory(data: { name: string; id: string }, user: User) {
    try {
      const existingUser = await this.userModel.findOne({
        where: { id: user.id },
      });

      if (!existingUser) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      const existingCategory = await this.categoryModel.findOne({
        where: { id: Number(data.id) },
      });

      if (!existingCategory) {
        throw new NotFoundException('Categoriya topilmadi');
      }

      if (existingUser.roles !== Role.SELLER) {
        throw new BadRequestException("Sizda bunday huquq yo'q");
      }

      const res = await this.subCategoryModel.create({
        category: existingCategory,
        name: data.name,
      });

      await this.subCategoryModel.save(res);
      res.slug = `${slugifyWithApostrophe(res.name)}-${res.id}`;
      await this.subCategoryModel.save(res);

      return res;
    } catch (error) {
      throw new BadRequestException(error.message || 'Xatolik yuz berdi');
    }
  }

  async getCategory() {
    try {
      const data = await this.subCategoryModel.find();

      return { data };
    } catch (error) {
      throw new Error(error.message || 'Xatolik yz berdi');
    }
  }
}
