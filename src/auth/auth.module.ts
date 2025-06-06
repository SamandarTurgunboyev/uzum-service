import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { OtpModule } from 'src/otp/otp.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/schemas/user.schema';
import { Product } from 'src/schemas/product.schema';

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
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
