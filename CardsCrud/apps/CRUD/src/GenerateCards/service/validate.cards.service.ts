import { BadRequestException, Inject } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import axios, { AxiosResponse } from "axios";
import { Model } from "mongoose";
import { ContextService } from "../../Auth/context.service";
import { Cards } from "../../Cards/cards.schema";
import { CreateCardsDto } from "../../Cards/dto/create.cards.dto";
import { ClientRMQ } from "@nestjs/microservices";


export class CardsValidateService {
    constructor(
        @InjectModel(Cards.name) private readonly cardsModel: Model<Cards>,
        private readonly contextService: ContextService,
        @Inject('DECK_IMPORT_SERVICE') private rabbitClient: ClientRMQ
    ) {}

    async validateDecks(createCardDto: CreateCardsDto): Promise<string> {
        const { cardCommander, cards } = createCardDto;
      
    
        if (!await this.isLegendaryCreature(cardCommander)) {
          throw new BadRequestException("O comandante não é uma criatura lendária.");
        }
      
        if (cards.length !== 99) {
          throw new BadRequestException("O baralho deve conter exatamente 99 cartas além do comandante.");
        }
      
        const commanderColors = await this.getCommanderColors(cardCommander);
        const invalidCards = cards.filter(card => !this.isCardInCommanderColors(card, commanderColors));
        if (invalidCards.length > 0) {
          throw new BadRequestException(`As seguintes cartas não seguem a identidade de cor do comandante: ${invalidCards.join(', ')}`);
        }
      
        const cardCounts = this.countCards(cards);
        const duplicateCards = Object.keys(cardCounts).filter(card => cardCounts[card] > 1 && !this.isBasicLand(card));
        if (duplicateCards.length > 0) {
          throw new BadRequestException(`O baralho contém cartas duplicadas, exceto terrenos básicos: ${duplicateCards.join(', ')}`);
        }

        const createDeck = new this.cardsModel({
            cardCommander: cardCommander,
            cards: cards
        })
        await createDeck.save();
        this.rabbitClient.emit('deck_import_queue', createDeck)
        return 'importado!'

      }

      
      private async isLegendaryCreature(cardCommander: string): Promise<boolean> {
        const response = await axios.get(`https://api.magicthegathering.io/v1/cards?name=${encodeURIComponent(cardCommander)}`);
        const cardData = response.data.cards.find(card => card.name === cardCommander);
        return cardData && cardData.supertypes.includes('Legendary') && cardData.types.includes('Creature');
      }
      
      private async getCommanderColors(cardCommander: string): Promise<string[]> {
    
        const response = await axios.get(`https://api.magicthegathering.io/v1/cards?name=${encodeURIComponent(cardCommander)}`);
        const cardData = response.data.cards.find(card => card.name === cardCommander);
        return cardData ? cardData.colors || [] : [];
      }
      
      private isCardInCommanderColors(card: string, commanderColors: string[]): boolean {
    
        const cardColors = this.getCardColors(card);
        return cardColors.every(color => commanderColors.includes(color));
      }
      
      private getCardColors(card: string): string[] {
        const mockCardColors: { [key: string]: string[] } = {
          "Plains": ["W"],
          "Island": ["U"],
          "Swamp": ["B"],
          "Mountain": ["R"],
          "Forest": ["G"],
        };
        return mockCardColors[card] || [];
      }
      
      private countCards(cards: string[]): { [card: string]: number } {
        return cards.reduce((acc, card) => {
          acc[card] = (acc[card] || 0) + 1;
          return acc;
        }, {});
      }
      
      private isBasicLand(card: string): boolean {
        return ["Plains", "Island", "Swamp", "Mountain", "Forest"].includes(card);
      }
      

   


      
}