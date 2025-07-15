import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CategoryService } from './category.service';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiBody({
    schema: {
      example: { name_ru: 'string', name_uz: 'string', name_en: 'string' },
    },
  })
  @ApiResponse({
    schema: {
      example: {
        id: 'number',
        name_ru: 'string',
        name_uz: 'string',
        name_en: 'string',
        slug: 'string',
        createdAt: 'string',
        updateAt: 'string',
      },
    },
  })
  @UseGuards(AuthGuard)
  async createCategory(
    @Body() data: { name_ru: string; name_uz: string; name_en: string },
    @Req() req: Request,
  ) {
    const user = req['user'];
    const res = await this.categoryService.create(data, user);

    return res;
  }

  @Get()
  @ApiResponse({
    schema: {
      example: {
        data: [
          {
            id: 'number',
            name: 'string',
            slug: 'string',
            created_at: 'string',
            update_at: 'string',
          },
        ],
      },
    },
  })
  async getCategory(@Headers('Accept-Language') lng: string) {
    const res = await this.categoryService.getCategory(lng);
    return res;
  }
}
