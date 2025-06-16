import { Controller, Get, Headers, HttpCode, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DiscountedService } from './discounted.service';

@Controller('product/discounted-product')
@ApiTags('Product')
export class DiscountedController {
  constructor(private readonly productService: DiscountedService) {}

  @HttpCode(200)
  @Get()
  async discountedProduct(
    @Headers('accept-language') lang: string,
    @Query() query: { page: string; page_size: string },
  ) {
    const data = await this.productService.discountedProduct(lang, query);
    return { data };
  }
}
