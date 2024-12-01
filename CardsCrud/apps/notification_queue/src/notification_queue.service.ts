import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ, MessagePattern, RmqContext } from '@nestjs/microservices';
import { cardsDto } from 'apps/rmq-process/src/deckImport_queue/cards.dto';
import { NotificationGateway } from './websockets/notification.gateway';

@Injectable()
export class NotificationQueueService {
  constructor(
    @Inject('DECK_UPDATE_QUEUE') private rabbitClient: ClientRMQ,
    private notificationGateway: NotificationGateway,
  ) {}

  async defaultNestJs(cards: cardsDto) {
    console.log(`received a import new Cards!`, );
  
  }
  

  @MessagePattern('deck_updates_queue') 
  async handleDeckUpdate(data: any, @Inject('RmqContext') context: RmqContext) {
    console.log('Mensagem consumida da fila:', data);
    this.notificationGateway.emitDeckUpdate(data);
    const channel = context.getChannelRef();
    const message = context.getMessage();
    channel.ack(message);  
  }
  

}
