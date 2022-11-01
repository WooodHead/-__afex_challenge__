import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  const cors: CorsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    preflightContinue: false,
  };
  app.enableCors(cors);

  const config = new DocumentBuilder()
    .setTitle('Afex Challenge RESTFul API')
    .setDescription(
      'AFEX CHALLENGE (Serverless, AWS, NestJS, DynamoDB and Swagger)',
    )
    .setVersion('1.0')
    .setContact(
      'Roger Anzoátegui',
      'https://www.linkedin.com/in/rogeranzoategui/',
      'roger.anzoategui@gmail.com',
    )
    .setBasePath('/api')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document);

  await app.listen(process.env.PORT || 3000);
  logger.log(`App running on port ${process.env.PORT || 3000}`);
}
bootstrap();
