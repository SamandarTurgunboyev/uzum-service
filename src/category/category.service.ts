import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/role.enum';
import { Category } from 'src/schemas/category.schema';
import { User } from 'src/schemas/user.schema';
import { lang_name } from 'src/utilits/name.utilits';
import { slugifyWithApostrophe } from 'src/utilits/slug.utilits';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryModel: Repository<Category>,
    @InjectRepository(User)
    private readonly userModel: Repository<User>,
  ) {}

  async create(
    data: { name_ru: string; name_uz: string; name_en: string },
    user: User,
  ) {
    try {
      const existingUser = await this.userModel.findOne({
        where: { id: user.id },
      });

      if (!existingUser) {
        throw new NotFoundException('Foydalanuvchi topilmadi');
      }

      if (existingUser.roles !== Role.SELLER) {
        throw new BadRequestException("Sizda bunday huquq yo'q");
      }
      const new_Category = await this.categoryModel.create({
        name_uz: data.name_uz,
        name_ru: data.name_ru,
        name_en: data.name_uz,
      });

      await this.categoryModel.save(new_Category);

      new_Category.slug = `${slugifyWithApostrophe(new_Category.name_uz)}-${new_Category.id}`;

      await this.categoryModel.save(new_Category);

      return new_Category;
    } catch (error) {
      throw new BadRequestException(error.message || 'Xatolik yuz berdi');
    }
  }

  async getCategory(acceptLanguage: string) {
    try {
      const data = await this.categoryModel.find();
      const lang = data.map((cat) => {
        const { name } = lang_name(acceptLanguage, cat);

        return {
          name: name,
          id: cat.id,
          created_at: cat.createdAt,
          update_at: cat.updateAt,
          slug: cat.slug,
        };
      });

      return {
        data: lang,
      };
    } catch (error) {
      throw new BadRequestException(error.message || 'Xatolik yuz berdi');
    }
  }
}
