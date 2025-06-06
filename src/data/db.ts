import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from 'src/schemas/otp.schema';
import { Product } from 'src/schemas/product.schema';
import { User } from 'src/schemas/user.schema';

const DB = TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '0515',
  database: process.env.DB_BASE || 'uzum',
  entities: [User, Otp, Product],
  synchronize: true,
});

export default DB;
