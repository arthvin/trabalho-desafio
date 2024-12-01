import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })  
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  emitDeckUpdate(deckData: any) {
    this.server.emit('deck_updated', deckData);  
    console.log('Evento de atualização de baralho enviado para os clientes');
  }
}