import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { multerConfig } from 'src/multer.config';
import { ProductDto } from './dto/dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create/')
  @UsePipes(ValidationPipe)
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
  @ApiBody({
    description:
      "Agarda disCount false bo'lsa ya'ni chegirma yo'q bolsa disPrice:chegirma narxi shart emas. Agarda disCount true bo'lsa ya'ni chegirma bor bolsa disPrice:chegirma narxi shart.",
    schema: {
      example: {
        name_uz: 'string',
        name_ru: 'string',
        name_en: 'string',
        description_uz: 'string',
        description_en: 'string',
        description_ru: 'string',
        price: 'string',
        disCount: 'boolean',
        disPrice: 'string',
      },
    },
  })
  @ApiResponse({
    schema: {
      example: {
        data: {
          id: 'number',
          name_uz: 'string',
          name_ru: 'string',
          name_en: 'string',
          description_uz: 'string',
          description_ru: 'string',
          description_en: 'string',
          price: 'string',
          disCount: 'boolean',
          disPrice: 'string',
          banner: ['string'],
          media: ['string'],
          store: {
            id: 'number',
            store_name: 'string',
            addres: 'string',
            banner: 'string',
          },
        },
      },
    },
  })
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

    return { data };
  }

  @HttpCode(200)
  @Get('/getAll')
  @ApiResponse({
    schema: {
      example: {
        data: [
          {
            id: 'number',
            name: 'string',
            description: 'string',
            price: 'string',
            disCount: 'boolean',
            disPrice: 'string',
            banner: ['string'],
            media: ['string'],
          },
        ],
      },
    },
  })
  async getAllProduct(@Headers('Accept-Language') acceptLanguage: string) {
    const data = await this.productService.getAll(acceptLanguage);
    return { data };
  }

  @HttpCode(200)
  @Get('/my-product/')
  @UseGuards(AuthGuard)
  @ApiResponse({
    schema: {
      example: {
        data: [
          {
            id: 'number',
            name: 'string',
            description: 'string',
            price: 'string',
            disCount: 'boolean',
            disPrice: 'string',
            category: {
              id: 'string',
            },
            banner: ['string'],
            media: ['string'],
          },
        ],
      },
    },
  })
  async getMyProduct(
    @Req() req: Request,
    @Headers('Accept-Language') lang: string,
  ) {
    const user = req['user'];
    const product = this.productService.getMyProduct(user, lang);
    return product;
  }

  @HttpCode(200)
  @Get('/monthly-products')
  async monthlyProducts(@Headers('accept-language') lang: string) {
    return this.productService.getProductsThisWeek(lang);
  }

  @HttpCode(200)
  @Get('/big-discount')
  async topDisCoint(@Headers('accept-language') lang: string) {
    return this.productService.topDiscount(lang);
  }

  @HttpCode(200)
  @Get('/discounted-product')
  async discountedProduct(@Headers('accept-language') lang: string) {
    return this.productService.discountedProduct(lang);
  }

  @HttpCode(200)
  @Get('/:id')
  @ApiResponse({
    schema: {
      example: {
        id: 'number',
        name: 'string',
        description: 'string',
        price: 'string',
        disCount: 'boolean',
        disPrice: 'string',
        banner: ['string'],
        media: ['string'],
        store: {
          id: 'number',
          store_name: 'string',
          addres: 'string',
          banner: 'string',
        },
      },
    },
  })
  async getOneProduct(
    @Param('id') id: string,
    @Headers('accept-language') lang: string,
  ) {
    return await this.productService.getOneProduct(lang, id);
  }
}
