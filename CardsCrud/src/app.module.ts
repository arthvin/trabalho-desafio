import { Module } from '@nestjs/common';
import { AppController } from '../apps/CRUD/src/app.controller';
import { AppService } from '../apps/CRUD/src/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsModule } from '../apps/CRUD/src/Cards/cards.module';
import { CardsGenerateModule } from '../apps/CRUD/src/GenerateCards/generate.cards.module';
import { AuthModule } from '../apps/CRUD/src/Auth/auth.module';
import { UsersModule } from '../apps/CRUD/src/Usuario/usuario.module';
import { NotificationQueueModule } from '../apps/notification_queue/src/notification_queue.module';
import { NotificationGateway } from '../apps/notification_queue/src/websockets/notification.gateway'; 
import { NotificationQueueService } from '../apps/notification_queue/src/notification_queue.service';
import { CardsService } from '../apps/CRUD/src/Cards/cards.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/AtividadeMagic'),
    CardsGenerateModule, 
    AuthModule, 
    CardsModule, 
    UsersModule, 
    NotificationQueueModule, 
  ],
  controllers: [AppController],
  providers: [
    AppService,
    NotificationGateway,
    NotificationQueueService, 
    CardsService,
  ],
})
export class AppModule {}
