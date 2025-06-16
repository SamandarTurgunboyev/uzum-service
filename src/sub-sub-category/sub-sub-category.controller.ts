import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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
    @Body() data: { name: string; id: string },
    @Req() req: Request,
  ) {
    const user = req['user'];
    return this.category.create(data, user);
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
    const data = await this.category.getCategory();
    return data;
  }
}
