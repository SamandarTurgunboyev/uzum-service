import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { CountriesModule } from './countries/countries.module';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { ProductModule } from './product/product.module';
import { StoreModule } from './store/store.module';
import DB from './data/db';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DB,
    ScheduleModule.forRoot(),
    CountriesModule,
    AuthModule,
    OtpModule,
    ProductModule,
    StoreModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
