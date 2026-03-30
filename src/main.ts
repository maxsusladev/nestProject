import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appCreate } from './app.create';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appCreate(app)
  await app.listen(Number(process.env.PORT) || 4001, '0.0.0.0');
}
bootstrap();
