// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Registration of the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // Enable global validation pipelines
  app.useGlobalPipes(new ValidationPipe());

  // Setting up Swagger
  const config = new DocumentBuilder()
    .setTitle('Superset Connector API')
    .setDescription('API for interaction with Superset')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
