import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, UseGuards } from "@nestjs/common";
import { CardsService } from "./cards.service";
import { CreateCardsDto } from "./dto/create.cards.dto";
import { Cards } from "./cards.schema";
import { UpdateCardsDto } from "./dto/update.cards.dto";
import { AuthGuard } from "../Auth/guard/auth.guard";
import { RolesGuard } from "../Auth/guard/roles.guard";
import { Roles } from "../Auth/roles.decorator";
import { Role } from "../Auth/enum/role.enum";

@UseGuards(AuthGuard, RolesGuard)
@Controller('cards')
export class CardsController {
    constructor(private readonly CardsService: CardsService){}

    
    @Post()
    async create(@Body() CreateCardsDto: CreateCardsDto): Promise<Cards> {
        try {
            return this.CardsService.create(CreateCardsDto)
        } catch (error) {
            throw new HttpException({"message": "ERRO AO CRIAR O DECK"}, HttpStatus.BAD_REQUEST)
        }
    }

    @Roles(Role.Admin)
    @Get()
    async findAll(): Promise<Cards[]>{
        try {
            return this.CardsService.findAll()
        } catch (error) {
            throw new HttpException({"message": "ERRO AO ENCONTRAR OS DECKS"}, HttpStatus.BAD_REQUEST) 
        }
    }

    @Get(':id')
    FindOne(@Param('id') id: string): Promise<Cards>{
        try {
            return this.CardsService.findById(id)
        } catch (error) {
            throw new HttpException({"message": "ERRO AO ENCONTRAR O DECK POR ID"}, HttpStatus.BAD_REQUEST) 
        }
    }

    @Post(':id')
    @HttpCode(200)
    update(@Param('id') id: string, @Body() UpdateCardsDto: UpdateCardsDto){
            try {
                return this.CardsService.update(id, UpdateCardsDto)
            } catch (error) {
                throw new HttpException({"message": "ERRO AO ATUALIZAR O DECK"}, HttpStatus.BAD_REQUEST) 
            }
    }

    @Delete(':id')
    delete(@Param('id') id: string){
        try {
            return this.CardsService.delete(id);
        } catch (error) {
            throw new HttpException({"message": "ERRO AO DELETAR O DECK"}, HttpStatus.BAD_REQUEST) 
        }
    }


}