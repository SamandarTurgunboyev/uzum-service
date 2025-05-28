import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.setGlobalPrefix("/api/v1")
  const config = new DocumentBuilder()
    .setTitle('Uzum-clone')
    .setDescription('The Uzum-clone API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Bu yerga JWT token kiriting"
      },
      "JWT-auth"
    )
    .addTag('uzum-clone')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
