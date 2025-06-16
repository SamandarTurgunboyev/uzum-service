import {
  Body,
  Controller,
  Put,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { multerConfig } from 'src/multer.config';
import { AuthGuard } from '../auth.guard';
import { AuthDto } from '../dto/auth.dto';
import { UpdateProfileSwagger } from '../swagger/update.swagger';
import { UpdateService } from './update.service';

@Controller('auth/update/')
@ApiTags('Auth')
export class UpdateController {
  constructor(private readonly authService: UpdateService) {}

  @Put()
  @UseGuards(AuthGuard)
  @UpdateProfileSwagger()
  @UseInterceptors(FileInterceptor('images', multerConfig))
  async updateProfile(
    @UploadedFile() file: Express.Multer.File,
    @Body() data: Omit<AuthDto, 'password' | 'phone'>,
    @Req() req: Request,
  ) {
    const userPayload = req['user'];
    const response = await this.authService.editAccount(
      file,
      data,
      userPayload,
    );
    return response;
  }
}
