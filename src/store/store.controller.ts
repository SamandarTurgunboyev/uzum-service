import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { multerConfig } from 'src/multer.config';
import { StoreDto } from './dto/store.dto';
import { StoreService } from './store.service';

@Controller('store')
@ApiTags('Auth')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  @ApiBody({
    schema: {
      example: { store_name: 'string', address: 'string', banner: 'file' },
    },
  })
  @ApiResponse({
    schema: {
      example: {
        id: 'number',
        store_name: 'string',
        addres: 'string',
        banner: 'string',
        createdAt: 'string',
        updateAt: 'string',
      },
    },
  })
  @UseInterceptors(FileInterceptor('banner', multerConfig))
  async createStore(
    @UploadedFile() banner: Express.Multer.File,
    @Body() store: StoreDto,
    @Req() req: Request,
  ) {
    const user = req['user'];
    return this.storeService.createStore(store, banner, user);
  }
}
