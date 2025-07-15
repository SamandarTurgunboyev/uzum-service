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
import { MonthlyProductSwagger } from '../swagger/monthly.swagger';
import { MonthlyService } from './monthly.service';

@Controller('product/monthly-products')
@ApiTags('Product')
export class MonthlyController {
  constructor(private readonly productService: MonthlyService) {}

  @HttpCode(200)
  @Get()
  @UseGuards(OptionalAuthGuard)
  @MonthlyProductSwagger()
  async monthlyProducts(
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
    const data = await this.productService.getProductsThisWeek(
      lang,
      query,
      user,
    );
    return {
      data,
    };
  }
}
