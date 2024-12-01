
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Cards, CardsSchema } from './cards.schema';
import { ContextService } from '../Auth/context.service';
import { UsersService } from '../Usuario/usuario.service';
import { UsersModule } from '../Usuario/usuario.module';


@Module({
  imports: [
    MongooseModule.forFeature([{name: Cards.name, schema: CardsSchema}]), UsersModule
  ],
  controllers: [CardsController],
  providers: [CardsService, ContextService, UsersService],
  exports: [CardsService],
})
export class CardsModule {}
