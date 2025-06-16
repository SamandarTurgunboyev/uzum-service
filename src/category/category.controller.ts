import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { CategoryService } from './category.service';

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiBody({ schema: { example: { name: 'string' } } })
  @ApiResponse({
    schema: {
      example: {
        id: 'number',
        name: 'string',
        slug: 'string',
        createdAt: 'string',
        updateAt: 'string',
      },
    },
  })
  @UseGuards(AuthGuard)
  async createCategory(@Body() data: { name: string }, @Req() req: Request) {
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
            createdAt: 'string',
            updateAt: 'string',
          },
        ],
      },
    },
  })
  async getCategory() {
    const res = await this.categoryService.getCategory();
    return res;
  }
}
