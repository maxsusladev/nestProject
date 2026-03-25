import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as dotenv from 'dotenv'
import { config } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Nest JS MasterClass - Blog app API')
    .setDescription('Use the base API URL as http')
    .addServer("http://localhost:4001")
    .setVersion('1.0')
    .build()


  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document)

  const configService = app.get(ConfigService)
  config.update({
    credentials: {
      accessKeyId: configService.get("appConfig.awsAccessKeyId")!,
      secretAccessKey: configService.get("appConfig.awsSecretAccessKey")!,
    },
    region: configService.get("appConfig.awsRegion")
  })

  app.enableCors()
  await app.listen(Number(process.env.PORT) || 4001, '0.0.0.0');
}
bootstrap();
