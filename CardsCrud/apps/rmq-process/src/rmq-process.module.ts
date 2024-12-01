import { Module } from '@nestjs/common';
import { RmqProcessController } from './deckImport_queue/rmq-process.controller';
import { RmqProcessService } from './deckImport_queue/rmq-process.service';
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
  controllers: [RmqProcessController],
  providers: [RmqProcessService],
})
export class RmqProcessModule {}
