import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CardsDocument = Cards & Document;

@Schema()
export class Cards extends Document {

    @Prop({ required: true })
    cardCommander: string;

    @Prop({ type: [String], required: true })
    cards: string[];

}

export const CardsSchema = SchemaFactory.createForClass(Cards);