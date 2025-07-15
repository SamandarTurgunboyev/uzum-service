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
import { lang_name } from 'src/utilits/name.utilits';
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

  async create(
    data: { name_uz: string; name_ru: string; name_en: string; id: string },
    user: User,
  ) {
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
        name_uz: data.name_uz,
        name_ru: data.name_ru,
        name_en: data.name_en,
        subCategory: existingCategory,
      });

      await this.categoryModel.save(res);

      res.slug = `${slugify(slugifyWithApostrophe(res.name_uz))}-${res.id}`;

      await this.categoryModel.save(res);

      return res;
    } catch (error) {
      throw new BadRequestException(error.message || 'Xatolik yuz berdi');
    }
  }

  async getCategory(lang: string, categoryId?: string) {
    try {
      let data;

      if (categoryId) {
        data = await this.categoryModel.find({
          where: {
            subCategory: { id: Number(categoryId) },
          },
          relations: {
            subCategory: true,
          },
        });
      } else {
        data = await this.categoryModel.find({
          relations: {
            subCategory: true,
          },
        });
      }

      const res = data.map((r: subSubCategory) => {
        const { name } = lang_name(lang, r);

        return {
          id: r.id,
          name: name,
          slug: r.slug,
          created_at: r.createdAt,
          update_at: r.updateAt,
        };
      });

      return { data: res };
    } catch (error) {
      throw new Error(error.message || 'Xatolik yuz berdi');
    }
  }

  async getOneCategory(lang: string, slug?: string) {
    try {
      const data = await this.categoryModel.find({
        where: {
          slug: slug,
        },
        relations: {
          subCategory: true,
        },
      });

      const res = data.map((r) => {
        const { name } = lang_name(lang, r);
        const { name: sub } = lang_name(lang, r.subCategory);
        return {
          name,
          id: r.id,
          slug: r.slug,
          subCategory: {
            id: r.subCategory.id,
            name: sub,
            slug: r.subCategory.slug,
            createdAt: r.subCategory.createdAt,
            updateAt: r.subCategory.updateAt,
          },
          createdAt: r.createdAt,
          updateAt: r.updateAt,
        };
      });

      return res;
    } catch (error) {
      throw new Error(error.message || 'Xatolik yuz berdi');
    }
  }
}
