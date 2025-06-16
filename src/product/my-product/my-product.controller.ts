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
import { AuthGuard } from 'src/auth/auth.guard';
import { MyProductSwagger } from '../swagger/myProduct';
import { MyProductService } from './my-product.service';

@Controller('product/my-product/')
@ApiTags('Product')
export class MyProductController {
  constructor(private readonly productService: MyProductService) {}

  @HttpCode(200)
  @Get()
  @UseGuards(AuthGuard)
  @MyProductSwagger()
  async getMyProduct(
    @Req() req: Request,
    @Headers('Accept-Language') lang: string,
    @Query() query: { page: string; page_size: string },
  ) {
    const user = req['user'];
    const data = await this.productService.getMyProduct(user, lang, query);
    return {
      data,
    };
  }
}
