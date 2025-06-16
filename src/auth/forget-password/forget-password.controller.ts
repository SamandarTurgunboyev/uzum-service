import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  ForgetNewPasswordConfirmSwagger,
  ForgetPassword,
  ForgetPasswordConfirmSwagger,
} from '../swagger/forget-password.swagger';
import { ForgetPasswordService } from './forget-password.service';

@Controller('auth/forget-password')
@ApiTags('Auth')
export class ForgetPasswordController {
  constructor(private readonly authService: ForgetPasswordService) {}

  @Post()
  @ForgetPassword()
  async forgetPassword(@Body('phone') phone: string) {
    const data = await this.authService.forgetPassword(phone);
    return data;
  }

  @Post('/confirm')
  @ForgetPasswordConfirmSwagger()
  async forgetPasswordConfirn(@Body() body: { phone: string; otp: string }) {
    const data = await this.authService.forgetPasswordConfirm(
      body.phone,
      body.otp,
    );
    return {
      accessToken: data.access_token,
      refreshToken: data.refreshToken,
    };
  }

  @Post('/newPasword/')
  @ForgetNewPasswordConfirmSwagger()
  async newPassword(
    @Body()
    body: {
      token: string;
      new_password: string;
      new_password_confirm: string;
    },
  ) {
    const data = await this.authService.newPassword(
      body.token,
      body.new_password,
      body.new_password_confirm,
    );
    return {
      user: data.user,
      accessToken: data.access_token,
      refreshToken: data.refreshToken,
    };
  }
}
