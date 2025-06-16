import {
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OptionalAuthGuard } from 'src/auth/optional-auth.guard';
import { GetOneProduct } from '../swagger/getOne';
import { GetOneService } from './get-one.service';

@Controller('product/:id')
@ApiTags('Product')
export class GetOneController {
  constructor(private readonly productService: GetOneService) {}

  @HttpCode(200)
  @Get()
  @UseGuards(OptionalAuthGuard)
  @GetOneProduct()
  async getOneProduct(
    @Param('id') id: string,
    @Headers('accept-language') lang: string,
    @Req() req: Request,
  ) {
    const user = req['user'];
    return await this.productService.getOneProduct(lang, id, user);
  }
}
