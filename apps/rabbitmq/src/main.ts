import { NestFactory } from '@nestjs/core';
import { RabbitmqModule } from './rabbitmq.module';
import { Transport } from '@nestjs/microservices';
import { RmqService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(RabbitmqModule);
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions('BILLING'));

  await app.startAllMicroservices();
}
bootstrap();
