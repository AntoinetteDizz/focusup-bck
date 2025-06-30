import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task, Subtask, TaskSubtask } from './entities/task.entity';
import { AiService } from './services/ai.service';
import { SubtasksService } from './services/subtasks.service';
import { SubtasksController } from './subtasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Subtask, TaskSubtask])],
  controllers: [TasksController, SubtasksController],
  providers: [TasksService, AiService, SubtasksService],
  exports: [TasksService],
})
export class TasksModule {} 