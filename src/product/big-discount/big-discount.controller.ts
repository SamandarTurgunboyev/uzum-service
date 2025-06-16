import { Controller, Get, Headers, HttpCode, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BigDiscountSwagger } from '../swagger/bigDiscount';
import { BigDiscountService } from './big-discount.service';

@Controller('product/big-discount')
@ApiTags('Product')
export class BigDiscountController {
  constructor(private readonly productService: BigDiscountService) {}
  @HttpCode(200)
  @Get()
  @BigDiscountSwagger()
  async topDisCoint(
    @Headers('accept-language') lang: string,
    @Query() query: { page: string; page_size: string },
  ) {
    const data = await this.productService.topDiscount(lang, query);
    return { data };
  }
}
