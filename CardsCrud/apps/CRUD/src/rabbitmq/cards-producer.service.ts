import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy, ClientRMQ } from '@nestjs/microservices';
import { CreateCardsDto } from '../Cards/dto/create.cards.dto';
import { Client } from '@nestjs/microservices/external/nats-client.interface';


@Injectable()
export class CardsProducerService {
    constructor(@Inject('DECK_IMPORT_SERVICE') private rabbitClient: ClientRMQ) {}
    placeCard(cards: CreateCardsDto) {
        this.rabbitClient.emit('deck_import_queue', cards);
        return { message: 'deck importado passou!'}
    }
    
}
