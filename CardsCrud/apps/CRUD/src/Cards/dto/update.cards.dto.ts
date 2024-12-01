import { IsArray, IsString } from "class-validator";

export class UpdateCardsDto{
    @IsString()
    cardCommander: string;

    @IsArray()
    cards: string[];

    
}