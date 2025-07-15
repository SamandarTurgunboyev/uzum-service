import {
  Controller,
  Get,
  Headers,
  HttpCode,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { DiscountedService } from './discounted.service';

@Controller('product/discounted-product')
@ApiTags('Product')
export class DiscountedController {
  constructor(private readonly productService: DiscountedService) {}

  @HttpCode(200)
  @Get()
  @UseGuards(OptionalAuthGuard)
  async discountedProduct(
    @Headers('accept-language') lang: string,
    @Query()
    query: {
      page: string;
      page_size: string;
      min_price: string;
      max_price: string;
      brand: string;
      category: string;
    },
    @Req() req: Request,
  ) {
    const user = req['user'];
    const data = await this.productService.discountedProduct(lang, query, user);
    return { data };
  }
}
