import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { SubCategoryService } from './sub-category.service';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subService: SubCategoryService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiBody({
    schema: {
      example: {
        name_uz: 'string',
        name_ru: 'string',
        name_en: 'string',
        id: 'CategoryId',
      },
    },
  })
  @ApiResponse({
    schema: {
      example: {
        id: 'number',
        name_uz: 'string',
        name_ru: 'string',
        name_en: 'string',
        slug: 'string',
        category: {
          id: 'number',
          name_uz: 'string',
          name_ru: 'string',
          name_en: 'string',
          slug: 'string',
          createdAt: 'string',
          updateAt: 'string',
        },
        createdAt: 'string',
        updateAt: 'string',
      },
    },
  })
  async create(
    @Body()
    data: { name_uz: string; name_ru: string; name_en: string; id: string },
    @Req() req: Request,
  ) {
    const user = req['user'];
    const res = await this.subService.createCategory(data, user);
    return res;
  }

  @Get()
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    description: 'Filter by category ID',
  })
  @ApiResponse({
    schema: {
      example: {
        data: [
          {
            id: 'number',
            name: 'string',
            slug: 'string',
            createdAt: 'string',
            updateAt: 'string',
            subSubCategories: [
              {
                id: 'number',
                name: 'string',
                slug: 'string',
                createdAt: 'string',
                updateAt: 'string',
              },
            ],
          },
        ],
      },
    },
  })
  async getCategory(
    @Headers('Accept-Language') lang: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const data = await this.subService.getCategory(lang, categoryId);

    return data;
  }
}
