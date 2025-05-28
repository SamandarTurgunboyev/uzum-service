import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CountriesModule } from './countries/countries.module';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [ConfigModule.forRoot(), MongooseModule.forRoot(process.env.MONGO_URL!), CountriesModule, AuthModule, OtpModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
