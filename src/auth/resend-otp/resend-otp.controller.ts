import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RegisterResendSwagger } from '../swagger/register.swagger';
import { ResendOtpService } from './resend-otp.service';

@Controller('auth/register/resend-otp')
@ApiTags('Auth')
export class ResendOtpController {
  constructor(private readonly authService: ResendOtpService) {}

  @HttpCode(201)
  @RegisterResendSwagger()
  @Post()
  async resendOtp(@Body('phone') phone: string) {
    return this.authService.resendOtp(phone);
  }
}
