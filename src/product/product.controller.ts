import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { multerConfig } from 'src/multer.config';
import { ProductDto } from './dto/dto';
import { ProductService } from './product.service';
import { CreateProductSwagger } from './swagger/create';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create/')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'banner', maxCount: 5 },
        { name: 'media', maxCount: 10 },
      ],
      multerConfig,
    ),
  )
  @CreateProductSwagger()
  async createProduct(
    @UploadedFiles()
    files: { banner?: Express.Multer.File[]; media?: Express.Multer.File[] },
    @Body() product: ProductDto,
    @Req() req: Request,
  ) {
    const users = req['user'];
    const banners = files.banner ?? [];
    const medias = files.media ?? [];
    const data = await this.productService.createProduct(
      product,
      users,
      banners,
      medias,
    );

    return data;
  }
}
