import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
@Processor('tasks')
export class TaskQueueProcessor {
  @Process()
  async handleTask(job: Job): Promise<void> {
    console.log(`Processing task: ${job.name} with data:`, job.data);
    if (job.name === 'authOperation') {
      console.log('Handling authentication operation with priority!');
    } else if (job.name === 'updateDeck') {
      console.log('Handling deck update operation.');
    }
  }
}