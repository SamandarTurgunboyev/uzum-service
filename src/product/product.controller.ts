import { Body, Controller, Get, Headers, HttpCode, Param, Post, Req, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto/dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { multerConfig } from 'src/multer.config';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @Post("/create")
    @UsePipes(ValidationPipe)
    @UseGuards(AuthGuard)
    @UseInterceptors(FileFieldsInterceptor(
        [
            { name: 'banner', maxCount: 5 },
            { name: 'media', maxCount: 10 },
        ],
        multerConfig
    ))
    async createProduct(
        @UploadedFiles() files: { banner?: Express.Multer.File[], media?: Express.Multer.File[] },
        @Body() product: ProductDto,
        @Req() req: Request,
        @Headers('accept-language') acceptLanguage: string
    ) {
        const users = req["user"]
        const banners = files.banner ?? [];
        const medias = files.media ?? [];
        const data = await this.productService.createProduct(product, users, banners, medias, acceptLanguage)

        return { data }
    }

    @HttpCode(200)
    @Get('/getAll')
    async getAllProduct(@Headers('accept-language') acceptLanguage: string) {
        const data = await this.productService.getAll(acceptLanguage)
        return { data }
    }

    @HttpCode(200)
    @Get("/:id")
    async getOneProduct(@Param("id") id: string, @Headers('accept-language') lang: string) {
        return await this.productService.getOneProduct(lang, id)
    }

}
