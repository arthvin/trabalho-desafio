import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class ContextService {
  private context: any = {}; 

  setUserId(userId: string) {
    this.context.user = userId;
  }

  getUserId(): string {
    return this.context.user;
  }
}
