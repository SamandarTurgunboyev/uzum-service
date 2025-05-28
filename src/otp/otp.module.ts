import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Otp, OtpSchema } from 'src/schemas/otp.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Otp.name, schema: OtpSchema }
  ])],
  providers: [OtpService],
  controllers: [OtpController],
  exports: [OtpService],
})
export class OtpModule { }
