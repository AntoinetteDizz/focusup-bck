import { IsUUID, IsOptional, IsInt, Min } from 'class-validator';

export class CreateTaskSubtaskDto {
  @IsUUID()
  taskId: string;

  @IsUUID()
  subtaskId: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  orderIndex?: number;
} 