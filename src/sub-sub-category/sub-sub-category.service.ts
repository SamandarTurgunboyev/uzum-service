import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role.enum';
import { SubCategory } from 'src/schemas/subCategory.schema';
import { subSubCategory } from 'src/schemas/subSubCategory.schema';
import { User } from 'src/schemas/user.schema';
import { slugifyWithApostrophe } from 'src/utilits/slug.utilits';
import { slugify } from 'transliteration';
import { Repository } from 'typeorm';

@Injectable()
export class SubSubCategoryService {
  constructor(
    @InjectRepository(SubCategory)
    private readonly subCategoryModel: Repository<SubCategory>,

    @InjectRepository(subSubCategory)
    private readonly categoryModel: Repository<subSubCategory>,

    @InjectRepository(User)
    private readonly userModel: Repository<User>,
  ) {}

  async create(data: { name: string; id: string }, user: User) {
    try {
      const existingUser = await this.userModel.findOne({
        where: { id: user.id },
      });

      if (!existingUser) {
        throw new NotFoundException('foydalanuvchi topilmadi');
      }

      const existingCategory = await this.subCategoryModel.findOne({
        where: { id: Number(data.id) },
      });

      if (!existingCategory) {
        throw new NotFoundException('Categoriya topilmadi');
      }

      if (existingUser.roles !== Role.SELLER) {
        throw new BadRequestException("Sizda bunday huquq yo'q");
      }

      const res = await this.categoryModel.create({
        name: data.name,
        subCategory: existingCategory,
      });

      await this.categoryModel.save(res);

      res.slug = `${slugify(slugifyWithApostrophe(res.name))}-${res.id}`;

      await this.categoryModel.save(res);

      return res;
    } catch (error) {
      throw new BadRequestException(error.message || 'Xatolik yuz berdi');
    }
  }

  async getCategory() {
    try {
      const data = await this.categoryModel.find();

      return { data };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
