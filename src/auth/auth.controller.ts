import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ProfileSwagger } from './swagger/profile.swagger';
import { UpdatePasswordSwagger } from './swagger/update.swagger';

@ApiBearerAuth('JWT-auth')
@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/profile/')
  @ProfileSwagger()
  @UseGuards(AuthGuard)
  async myProfile(@Req() req: Request) {
    const userPayload = req['user'];
    const response = await this.authService.myProfile(userPayload);
    return response;
  }

  @Put('/new-password')
  @UpdatePasswordSwagger()
  @UseGuards(AuthGuard)
  async passwordUpdate(
    @Req() req: Request,
    @Body()
    data: {
      old_password: string;
      new_password: string;
      password_confirm: string;
    },
  ) {
    const userPayload = req['user'];
    const res = this.authService.editPasssword(userPayload, data);

    return res;
  }
}
