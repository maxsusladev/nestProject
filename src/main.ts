import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }))

  const config = new DocumentBuilder()
  .setTitle('Nest JS MasterClass - Blog app API')
  .setDescription('Use the base API URL as http')
  .addServer("http://localhost:3000")
  .setVersion('1.0')
  .build()


  const document  = SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app, document)
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
