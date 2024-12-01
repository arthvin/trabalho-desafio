import { Injectable } from '@nestjs/common';
import { TaskQueueService } from '../task-queue/task-queue.service';
@Injectable()
export class AuthService {
  constructor(private readonly taskQueueService: TaskQueueService) {}
  async authenticateUser(user: any): Promise<void> {
    const priority = user.role === 'admin' ? 1 : 5;
    await this.taskQueueService.addTask('authOperation', { userId: user.id }, priority);
  }
}