import { Body, Controller, HttpException, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { CardsGenerateService } from "./service/generate.cards.service";
import { CardsValidateService } from "./service/validate.cards.service";
import { AuthGuard } from "../Auth/guard/auth.guard";
import { CreateCardsDto } from "../Cards/dto/create.cards.dto";
import { CardsService } from "../Cards/cards.service";

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsGenerateController {
    constructor(private readonly CardsGenerateService: CardsGenerateService, private readonly CardsService: CardsService, private readonly CardsValidateService: CardsValidateService) {}

    @Post('generate')
    async createCards(): Promise<CreateCardsDto> {
        return this.CardsGenerateService.generate();
      }
    
    
    @Post('import')
    async importDeck(@Body() createCardsDto: CreateCardsDto): Promise<string> {
        try {
          return await this.CardsValidateService.validateDecks(createCardsDto);
        } catch (e) {
          throw new HttpException(
            { message: 'Erro ao importar o baralho', error: e.message },
            HttpStatus.BAD_REQUEST
          );
        }
    }
}