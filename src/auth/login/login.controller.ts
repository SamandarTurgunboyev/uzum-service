import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthDto } from '../dto/auth.dto';
import { LoginSwagger } from '../swagger/login.swagger';
import { LoginService } from './login.service';

@ApiBearerAuth('JWT-auth')
@Controller('auth/login')
@ApiTags('Auth')
export class LoginController {
  constructor(private readonly authService: LoginService) {}

  @HttpCode(201)
  @Post()
  @LoginSwagger()
  async login(@Body() dto: Omit<AuthDto, 'firstName' | 'lastName'>) {
    const data = await this.authService.login(dto);
    return {
      accessToken: data.access_token,
      refreshToken: data.refreshToken,
    };
  }
}
