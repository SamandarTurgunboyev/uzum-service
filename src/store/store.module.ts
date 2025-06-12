import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpModule } from 'src/otp/otp.module';
import { Store } from 'src/schemas/store.schema';
import { User } from 'src/schemas/user.schema';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Store]), OtpModule],
  providers: [StoreService],
  controllers: [StoreController],
})
export class StoreModule {}
