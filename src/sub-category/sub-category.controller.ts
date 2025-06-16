import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
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
        name: 'string',
        id: 'CategoryId',
      },
    },
  })
  @ApiResponse({
    schema: {
      example: {
        id: 'number',
        name: 'string',
        slug: 'string',
        category: {
          id: 'number',
          name: 'string',
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
    @Body() data: { name: string; id: string },
    @Req() req: Request,
  ) {
    const user = req['user'];
    const res = await this.subService.createCategory(data, user);
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
    const data = await this.subService.getCategory();

    return data;
  }
}
