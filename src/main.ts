import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CountriesModule } from './countries/countries.module';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Asosiy Swagger (optional)
  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('User APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    include: [AuthModule, CountriesModule],
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
