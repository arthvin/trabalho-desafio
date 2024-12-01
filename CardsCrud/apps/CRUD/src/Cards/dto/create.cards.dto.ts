import { IsArray, IsString } from "class-validator";

export class CreateCardsDto {

  @IsString()
  cardCommander: string;

  @IsArray()
  cards: string[];

}