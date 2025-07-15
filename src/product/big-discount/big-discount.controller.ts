import { Controller, Get, Headers, HttpCode, Query } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { jwtConstants } from 'src/auth/constants';
import { BigDiscountSwagger } from '../swagger/bigDiscount';
import { BigDiscountService } from './big-discount.service';

@Controller('product/big-discount')
@ApiTags('Product')
export class BigDiscountController {
  constructor(
    private readonly productService: BigDiscountService,
    private readonly jwtService: JwtService,
  ) {}
  @HttpCode(200)
  @Get()
  @BigDiscountSwagger()
  async topDisCoint(
    @Headers('accept-language') lang: string,
    @Headers('authorization') authHeader: string,
    @Query()
    query: {
      page: string;
      page_size: string;
      min_price: string;
      max_price: string;
      brand: string;
      category: string;
    },
  ) {
    let userId: number | undefined = undefined;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });
        userId = payload?.id;
      } catch (error) {
        console.log('Invalid token, user anonymous');
      }
    }
    const data = await this.productService.topDiscount(lang, query, userId);
    return { data };
  }
}
