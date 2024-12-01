import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class TaskQueueService {
  constructor(@InjectQueue('tasks') private readonly taskQueue: Queue) {}

  async addTask(taskName: string, data: any, priority: number): Promise<void> {
    await this.taskQueue.add(taskName, data, {
      priority,
      attempts: 3, 
    });
  }
}
