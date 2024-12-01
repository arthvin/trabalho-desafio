import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientRMQ, MessagePattern, RmqContext } from '@nestjs/microservices';
import { cardsDto } from './cards.dto';

@Injectable()
export class RmqProcessService {
  constructor(@Inject('DECK_UPDATE_QUEUE') private rabbitClient: ClientRMQ) {}

  async defaultNestJs(cards: cardsDto) {
    console.log(`received a new Cards: card:`, cards);

    try {
      await this.validateDeck(cards);
      this.rabbitClient.emit('deck_updates_queue', cards);
      console.log('Enviado para fila deck_updates_queue');

    } catch (error) {
      console.error('Erro no processamento do deck:', error.message);
      throw new BadRequestException(error.message);
    }
  }

  private async validateDeck(cards: cardsDto) {
    const { cardCommander, cards: deckCards } = cards;

    if (!await this.isLegendaryCreature(cardCommander)) {
      throw new BadRequestException('O comandante não é uma criatura lendária.');
    }

    if (deckCards.length !== 99) {
      throw new BadRequestException('O baralho deve conter exatamente 99 cartas além do comandante.');
    }

    const commanderColors = await this.getCommanderColors(cardCommander);
    const invalidCards = deckCards.filter(card => !this.isCardInCommanderColors(card, commanderColors));
    if (invalidCards.length > 0) {
      throw new BadRequestException(`As seguintes cartas não seguem a identidade de cor do comandante: ${invalidCards.join(', ')}`);
    }

    const cardCounts = this.countCards(deckCards);
    const duplicateCards = Object.keys(cardCounts).filter(card => cardCounts[card] > 1 && !this.isBasicLand(card));
    if (duplicateCards.length > 0) {
      throw new BadRequestException(`O baralho contém cartas duplicadas, exceto terrenos básicos: ${duplicateCards.join(', ')}`);
    }

    console.log('Deck validado com sucesso.');
  }


  private async isLegendaryCreature(card: string): Promise<boolean> {
    return true;
  }

  private async getCommanderColors(card: string): Promise<string[]> {
    return ['red', 'green'];
  }

  private isCardInCommanderColors(card: string, commanderColors: string[]): boolean {
    return true;
  }

  private countCards(cards: string[]): Record<string, number> {
    return cards.reduce((acc, card) => {
      acc[card] = (acc[card] || 0) + 1;
      return acc;
    }, {});
  }

  private isBasicLand(card: string): boolean {
    return false;
  }

  getOrders(){
    return this.rabbitClient.send({cmd: 'fetch-cards'}, {});
  }


}
