import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RefreshTokenSwagger } from '../swagger/refreshToken.swagger';
import { RefreshTokenService } from './refresh-token.service';

@Controller('auth/refresh')
@ApiTags('Auth')
export class RefreshTokenController {
  constructor(private readonly authService: RefreshTokenService) {}

  @HttpCode(200)
  @Post()
  @RefreshTokenSwagger()
  async refresh(@Body() refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}
