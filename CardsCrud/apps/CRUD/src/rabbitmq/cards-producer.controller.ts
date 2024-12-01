import { Body, Controller, Post } from '@nestjs/common';
import { CardsProducerService } from './cards-producer.service';
import { CreateCardsDto } from '../Cards/dto/create.cards.dto';


@Controller('cards-producer')
export class CardsProducerController {
  constructor(private readonly cardsProducerService: CardsProducerService) {}

    @Post('place-card')
    placeCard(@Body() cards: CreateCardsDto) {
      return this.cardsProducerService.placeCard(cards);
      
    }
  
    

}
