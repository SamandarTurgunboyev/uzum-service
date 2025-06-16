import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from 'src/schemas/brand.schema';
import { User } from 'src/schemas/user.schema';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Brand])],
  providers: [BrandService],
  controllers: [BrandController],
})
export class BrandModule {}
