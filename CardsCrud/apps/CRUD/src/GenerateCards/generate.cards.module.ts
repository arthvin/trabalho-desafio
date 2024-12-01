import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsGenerateService } from './service/generate.cards.service';
import { CardsGenerateController } from './generate.cards.controller';
import { CardsValidateService } from './service/validate.cards.service';
import { Cards, CardsSchema } from '../Cards/cards.schema';
import { UsersModule } from '../Usuario/usuario.module';
import { CardsService } from '../Cards/cards.service';
import { ContextService } from '../Auth/context.service';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cards.name, schema: CardsSchema }]), UsersModule, ClientsModule.register([
      {
        name: 'DECK_IMPORT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'my_queue',
          queueOptions: {
            durable: false,
          }
        }
      }
    ])
  ],
  controllers: [CardsGenerateController],
  providers: [CardsService, CardsGenerateService, ContextService, CardsValidateService],
  exports: [CardsGenerateService],
})
export class CardsGenerateModule {}
