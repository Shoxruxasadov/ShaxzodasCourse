import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/module';

async function nest() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: [process.env.CORS] });
  await app.setGlobalPrefix('api').listen(process.env.PORT);
}

nest();
