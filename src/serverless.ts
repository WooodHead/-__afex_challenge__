import { ValidationPipe } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import serverlessExpress from '@vendia/serverless-express/src';
import { APIGatewayProxyHandler, Handler } from 'aws-lambda';
import express from 'express';
import { AppModule } from './app.module';

let cachedServer: Handler;

const bootstrapServer = async (): Promise<Handler> => {
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

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
    .setBasePath(`/${process.env.STAGE}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('doc', app, document);

  await app.init();
  return serverlessExpress({
    app: expressApp,
  });
};

export const handler: APIGatewayProxyHandler = async (
  event,
  context,
  callback,
) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return cachedServer(event, context, callback);
};
