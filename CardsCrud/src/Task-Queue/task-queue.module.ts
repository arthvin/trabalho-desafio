import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TaskQueueService } from './task-queue.service'; 

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'tasks',
    }),
  ],
  providers: [TaskQueueService],
  exports: [TaskQueueService],
})
export class TaskQueueModule {}
