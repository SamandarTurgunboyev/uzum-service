import { Controller, Get, Headers, HttpCode, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MonthlyProductSwagger } from '../swagger/monthly.swagger';
import { MonthlyService } from './monthly.service';

@Controller('product/monthly-products')
@ApiTags('Product')
export class MonthlyController {
  constructor(private readonly productService: MonthlyService) {}

  @HttpCode(200)
  @Get()
  @MonthlyProductSwagger()
  async monthlyProducts(
    @Headers('accept-language') lang: string,
    @Query() query: { page: string; page_size: string },
  ) {
    const data = await this.productService.getProductsThisWeek(lang, query);
    return {
      data,
    };
  }
}
