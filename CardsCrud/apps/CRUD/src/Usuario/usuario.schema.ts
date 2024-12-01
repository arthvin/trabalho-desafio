import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Role } from "../Auth/enum/role.enum";


@Schema()
export class User extends Document {

    @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true })
    _id: mongoose.Schema.Types.ObjectId;

    @Prop()
    username: string;

    @Prop()
    password: string;

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    roles: Role[];

}

export const UserShema = SchemaFactory.createForClass(User);