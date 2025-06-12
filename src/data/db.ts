import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/schemas/category.schema';
import { Otp } from 'src/schemas/otp.schema';
import { Product } from 'src/schemas/product.schema';
import { Store } from 'src/schemas/store.schema';
import { SubCategory } from 'src/schemas/subCategory.schema';
import { subSubCategory } from 'src/schemas/subSubCategory.schema';
import { User } from 'src/schemas/user.schema';

const DB = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '0515',
  database: process.env.DB_BASE || 'uzum',
  entities: [User, Otp, Product, Category, SubCategory, subSubCategory, Store],
  synchronize: true,
});

export default DB;
