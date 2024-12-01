import { InjectModel } from "@nestjs/mongoose";
import { Cards } from "./cards.schema";
import { Model } from "mongoose";
import { CreateCardsDto } from "./dto/create.cards.dto";
import { UpdateCardsDto } from "./dto/update.cards.dto";


export class CardsService{
    constructor(@InjectModel(Cards.name) private readonly CardsModel: Model<Cards>) {}

    async create(createCardsDto: CreateCardsDto): Promise<Cards> {
        const cards = new this.CardsModel(createCardsDto)
        return await cards.save()
    }

    async findAll(): Promise<Cards[]>{
        return await this.CardsModel.find().exec()
    }

    async findById(id: String): Promise<Cards> {
        try {
            return await this.CardsModel.findById(id).exec()
        } catch (error) {
            return null
        }
    }

    async update(id: string, UpdateCardsDto: UpdateCardsDto): Promise<Cards> {
        try {
            return await this.CardsModel.findByIdAndUpdate(id, UpdateCardsDto, {new: true});
        } catch (error) {
            return null;
        }
    }

    async delete(id: string) {
        try {
            return await this.CardsModel.findByIdAndDelete(id)
        } catch (error) {
            return null
        }
    }

    
    
}