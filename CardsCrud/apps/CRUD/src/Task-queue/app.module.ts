import { Module } from '@nestjs/common';
import { TaskQueueModule } from '../task-queue/task-queue.module';
@Module({
  imports: [
    TaskQueueModule,
  ],
})
export class AppModule {}