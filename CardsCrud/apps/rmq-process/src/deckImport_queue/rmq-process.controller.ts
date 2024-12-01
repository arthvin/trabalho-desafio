import { Controller, Get } from '@nestjs/common';
import { RmqProcessService } from './rmq-process.service';
import { Ctx, EventPattern, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { cardsDto } from './cards.dto';

@Controller()
export class RmqProcessController {
  constructor(private readonly rmqProcessService: RmqProcessService) {}

  @EventPattern('deck_import_queue')
  async defaultNestJs(@Payload() cards: cardsDto){
    return this.rmqProcessService.defaultNestJs(cards);
  }

  @MessagePattern({cmd: 'fetch-cards'})
  getOrdens() {
    return this.rmqProcessService.getOrders()
  }


}
