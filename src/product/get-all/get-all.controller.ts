import { Controller, Get, Headers, HttpCode, Query } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags } from '@nestjs/swagger';
import { jwtConstants } from 'src/auth/constants';
import { GetAllProductSwagger } from '../swagger/getAll.swagger';
import { GetAllService } from './get-all.service';

@Controller('product/get-all')
@ApiTags('Product')
export class GetAllController {
  constructor(
    private readonly productService: GetAllService,
    private readonly jwtService: JwtService,
  ) {}

  @HttpCode(200)
  @Get()
  @GetAllProductSwagger()
  async getAllProduct(
    @Headers('Accept-Language') acceptLanguage: string,
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
    const data = await this.productService.getAll(
      acceptLanguage,
      query,
      userId,
    );
    return { data };
  }
}
