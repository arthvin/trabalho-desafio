import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NotificationQueueModule } from './notification_queue.module';


async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    NotificationQueueModule,
    {
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://localhost:5672'],
            queue: 'deck_update_queue',
            queueOptions: {
              durable: false,
            }
          }
      
    }
  );
  await app.listen()
}
bootstrap();
