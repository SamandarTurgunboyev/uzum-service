import {
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { multerConfig } from 'src/multer.config';
import { ProductDto } from '../dto/dto';
import { CreateProductSwagger } from '../swagger/create';
import { UpdateService } from './update.service';

@Controller('product/:id')
@ApiTags('Product')
export class UpdateController {
  constructor(private readonly productService: UpdateService) {}

  @HttpCode(201)
  @UseGuards(AuthGuard)
  @Put()
  @CreateProductSwagger()
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'banner', maxCount: 5 },
        { name: 'media', maxCount: 10 },
      ],
      multerConfig,
    ),
  )
  async updateProduct(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() product: ProductDto,
    @UploadedFiles()
    files: { banner?: Express.Multer.File[]; media?: Express.Multer.File[] },
  ) {
    const user = req['user'];
    const banners = files.banner ?? [];
    const medias = files.media ?? [];
    return this.productService.updateProduct(
      id,
      user,
      product,
      banners,
      medias,
    );
  }
}
