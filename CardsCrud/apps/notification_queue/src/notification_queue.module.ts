import { Module } from '@nestjs/common';
import { NotificationQueueController } from './notification_queue.controller';
import { NotificationQueueService } from './notification_queue.service';
import { NotificationGateway } from './websockets/notification.gateway';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([
    {
      name: 'DECK_UPDATE_QUEUE',
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'deck_update_queue',
        queueOptions: {
          durable: false,
        }
      }
    }
  ])],
  controllers: [NotificationQueueController],
  providers: [NotificationQueueService,NotificationGateway],
})
export class NotificationQueueModule {}
