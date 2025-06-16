import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpModule } from 'src/otp/otp.module';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { RefreshTokenController } from './refresh-token/refresh-token.controller';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RegisterConfirmController } from './register-confirm/register-confirm.controller';
import { RegisterConfirmService } from './register-confirm/register-confirm.service';
import { RegisterController } from './register/register.controller';
import { RegisterService } from './register/register.service';
import { ResendOtpController } from './resend-otp/resend-otp.controller';
import { ResendOtpService } from './resend-otp/resend-otp.service';
import { UpdateController } from './update/update.controller';
import { UpdateService } from './update/update.service';
import { ForgetPasswordService } from './forget-password/forget-password.service';
import { ForgetPasswordController } from './forget-password/forget-password.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Product]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    OtpModule,
  ],
  providers: [
    RegisterService,
    RegisterConfirmService,
    ResendOtpService,
    LoginService,
    RefreshTokenService,
    AuthService,
    UpdateService,
    ForgetPasswordService,
  ],
  controllers: [
    RegisterController,
    RegisterConfirmController,
    ResendOtpController,
    LoginController,
    RefreshTokenController,
    AuthController,
    UpdateController,
    ForgetPasswordController,
  ],
})
export class AuthModule {}
