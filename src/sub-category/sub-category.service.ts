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
import { lang_name } from 'src/utilits/name.utilits';
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

  async createCategory(
    data: { name_uz: string; name_ru: string; name_en: string; id: string },
    user: User,
  ) {
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
        name_uz: data.name_uz,
        name_ru: data.name_ru,
        name_en: data.name_en,
      });

      await this.subCategoryModel.save(res);
      res.slug = `${slugifyWithApostrophe(res.name_uz)}-${res.id}`;
      await this.subCategoryModel.save(res);

      return res;
    } catch (error) {
      throw new BadRequestException(error.message || 'Xatolik yuz berdi');
    }
  }

  async getCategory(laguage: string, categoryId?: string) {
    try {
      let data;

      if (categoryId) {
        data = await this.subCategoryModel.find({
          where: {
            category: { id: Number(categoryId) },
          },
          relations: {
            subSubCategories: true,
          },
        });
      } else {
        data = await this.subCategoryModel.find({
          relations: {
            subSubCategories: true,
          },
        });
      }

      const sub = data.map((s: SubCategory) => {
        const { name } = lang_name(laguage, s);
        const subSubCategories = s.subSubCategories?.map((ssc) => {
          const { name } = lang_name(laguage, ssc);
          return {
            id: ssc.id,
            name,
            slug: ssc.slug,
            created_at: ssc.createdAt,
            update_at: ssc.updateAt,
          };
        });

        return {
          name,
          id: s.id,
          slug: s.slug,
          created_at: s.createdAt,
          update_at: s.updateAt,
          subSubCategories,
        };
      });

      return { data: sub };
    } catch (error) {
      throw new Error(error.message || 'Xatolik yuz berdi');
    }
  }
}
