import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { BrandService } from './brand.service';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post()
  @ApiBody({
    schema: {
      example: {
        name: 'string',
      },
    },
  })
  @ApiResponse({
    schema: {
      example: {
        id: 'number',
        name: 'string',
      },
    },
  })
  @UseGuards(AuthGuard)
  async create(@Body() data: { name: string }, @Req() req: Request) {
    const user = req['user'];
    const res = await this.brandService.create(data, user);
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
          },
        ],
      },
    },
  })
  async getAll() {
    const data = await this.brandService.getBrand();
    return data;
  }
}
