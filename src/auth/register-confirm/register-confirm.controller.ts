import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterConfirmSwagger } from '../swagger/register.swagger';
import { RegisterConfirmService } from './register-confirm.service';

@Controller('/auth/register/confirm')
@ApiTags('Auth')
export class RegisterConfirmController {
  constructor(private readonly authService: RegisterConfirmService) {}

  @HttpCode(201)
  @RegisterConfirmSwagger()
  @Post()
  async confirmOtp(@Body() body: { phone: string; otp: string }) {
    return this.authService.confirmOtp(body.phone, body.otp);
  }
}
