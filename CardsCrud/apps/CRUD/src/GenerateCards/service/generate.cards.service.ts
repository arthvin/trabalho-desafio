import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import axios, { AxiosResponse } from "axios";
import { Model } from "mongoose";
import { ContextService } from "../../Auth/context.service";
import { Cards } from "../../Cards/cards.schema";
import { CreateCardsDto } from "../../Cards/dto/create.cards.dto";

@Injectable()
export class CardsGenerateService {
    constructor(
    @InjectModel(Cards.name) private readonly cardsModel: Model<Cards>,
    private readonly contextService: ContextService
) {}

async generate(): Promise<CreateCardsDto> {
    const commander = await this.obterComandante();
    const commanderName = this.obterNomeCarta(commander);
    const otherCards = await this.get99NonLegendaryCards(commander.colors || []);
    const cardNames = otherCards.map(this.obterNomeCarta);
    const newDeck = new this.cardsModel({
     cardCommander: commanderName,
     cards: cardNames,
    });

    await newDeck.save();  
    return {
      cardCommander: commanderName,
      cards: cardNames
    };
  }

private async obterComandante(): Promise<any> {
    const resposta: AxiosResponse = await axios.get(
      'https://api.scryfall.com/cards/random?q=is%3Acommander',
    );
    const cartasComandante = resposta.data;
    return cartasComandante;
  }

  private obterNomeCarta(carta: any): string {
    return carta.name;
  }


  private async get99NonLegendaryCards(colors: string[]): Promise<any[]> {
    const colorQuery = colors.join(',');
    const allNonLegendaryCards = [];
    const maxPages = 3; 
    let currentPage = 1;

    while (currentPage <= maxPages) {
        const response: AxiosResponse = await axios.get(
            `https://api.magicthegathering.io/v1/cards?colors=${colorQuery}&supertypes!=legendary&page=${currentPage}`
        );
        const nonLegendaryCards = response.data.cards;

        if (nonLegendaryCards.length === 0) {
            break;
        }

        allNonLegendaryCards.push(...nonLegendaryCards);
        currentPage++;
    }

    console.log('Total de cartas não lendárias retornadas:', allNonLegendaryCards.length);
    return this.getRandomCards(allNonLegendaryCards, 99);
}


  private getRandomCards(cards: any[], count: number): any[] {
    const selectedCards = new Set();
  
    while (selectedCards.size < count) {
        const randomIndex = Math.floor(Math.random() * cards.length);
        const randomCard = cards[randomIndex];
  
        if (!selectedCards.has(randomCard.name)) {
            selectedCards.add(randomCard.name);
        } else {
            let newCardFound = false;
            for (let i = 0; i < cards.length; i++) {
                const newRandomCard = cards[Math.floor(Math.random() * cards.length)];
                if (!selectedCards.has(newRandomCard.name)) {
                    selectedCards.delete(randomCard.name); 
                    selectedCards.add(newRandomCard.name); 
                    console.log(`Substituindo ${randomCard.name} por ${newRandomCard.name}`);
                    newCardFound = true;
                    break; 
                }
            }
            if (!newCardFound && selectedCards.size < count) {
                console.warn('Não há mais cartas disponíveis para substituir.');
                break;
            }
        }
  
        if (selectedCards.size >= cards.length) {
            console.warn('Todas as cartas disponíveis foram selecionadas. Adicione mais cartas.');
            break;
        }
    }
  
    if (selectedCards.size !== count) {
        throw new BadRequestException('Não há cartas suficientes para completar o baralho. O baralho deve conter exatamente 99 cartas além do comandante.');
    }
  
    return Array.from(selectedCards).map(name => cards.find(card => card.name === name));
  }



  




}