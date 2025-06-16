import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthDto } from '../dto/auth.dto';
import { RegisterSwagger } from '../swagger/register.swagger';
import { RegisterService } from './register.service';

@Controller('auth/register')
@ApiTags('Auth')
export class RegisterController {
  constructor(private readonly authService: RegisterService) {}

  @HttpCode(201)
  @UsePipes(ValidationPipe)
  @Post()
  @RegisterSwagger()
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }
}
