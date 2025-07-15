import {
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { SaveService } from './save.service';

@Controller('/save-product/')
@ApiTags('Product')
export class SaveController {
  constructor(private readonly productService: SaveService) {}

  @HttpCode(201)
  @UseGuards(AuthGuard)
  @Post('/:id')
  async saveProduct(@Param('id') id: string, @Req() req: Request) {
    const user = req['user'];
    return this.productService.saveProduct(user, id);
  }

  @HttpCode(201)
  @UseGuards(AuthGuard)
  @Get()
  async getSaveProduct(
    @Req() req: Request,
    @Query()
    query: {
      page: string;
      page_size: string;
    },
    @Headers('Accept-Language') acceptLanguage: string,
  ) {
    const user = req['user'];
    const data = await this.productService.getSaveProduct(
      user,
      acceptLanguage,
      query,
    );
    return { data };
  }
}
