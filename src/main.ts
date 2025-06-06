import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CountriesModule } from './countries/countries.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ProductModule } from './product/product.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('User APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [AuthModule, CountriesModule, ProductModule],
  });
  SwaggerModule.setup('/api', app, document);

  // ADMIN Swagger
  const adminConfig = new DocumentBuilder()
    .setTitle('Admin API')
    .setDescription('Admin panel uchun API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
    include: [AdminModule, CountriesModule],
  });

  SwaggerModule.setup('admin-docs', app, adminDocument);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
