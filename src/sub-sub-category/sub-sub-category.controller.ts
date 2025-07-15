import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { SubSubCategoryService } from './sub-sub-category.service';
import { ChildCategorySwagger } from './swagger/child-category';

@Controller('child-category')
@ApiTags('Child-category')
export class SubSubCategoryController {
  constructor(private readonly category: SubSubCategoryService) {}

  @Post()
  @ChildCategorySwagger()
  @UseGuards(AuthGuard)
  async create(
    @Body()
    data: { name_uz: string; name_ru: string; name_en: string; id: string },
    @Req() req: Request,
  ) {
    const user = req['user'];
    return this.category.create(data, user);
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
          },
        ],
      },
    },
  })
  async getCategory(
    @Headers('Accept-Language') lang: string,
    @Query('categoryId') categoryId?: string,
  ) {
    const data = await this.category.getCategory(lang, categoryId);
    return data;
  }

  @Get('/:slug')
  @ApiResponse({
    schema: {
      example: {
        name: 'sting',
        id: 'number',
        slug: 'sting',
        subCategory: {
          id: 'number',
          name: 'sting',
          slug: 'sting',
          createdAt: 'sting',
          updateAt: 'sting',
        },
        createdAt: 'sting',
        updateAt: 'sting',
      },
    },
  })
  async getOneCategory(
    @Headers('Accept-Language') lang: string,
    @Param('slug') slug?: string,
  ) {
    return this.category.getOneCategory(lang, slug);
  }
}
