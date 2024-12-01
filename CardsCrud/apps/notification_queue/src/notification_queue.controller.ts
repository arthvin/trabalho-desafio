import { Controller, Get } from '@nestjs/common';
import { NotificationQueueService } from './notification_queue.service';
import { EventPattern, Payload } from '@nestjs/microservices';
import { cardsDto } from 'apps/rmq-process/src/deckImport_queue/cards.dto';

@Controller()
export class NotificationQueueController {
  constructor(private readonly notificationQueueService: NotificationQueueService) {}

  @EventPattern('deck_updates_queue')
  async defaultNestJs(@Payload() cards: cardsDto){
    return this.notificationQueueService.defaultNestJs(cards);
  }
}
