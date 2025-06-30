import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUUID, IsArray, ArrayUnique } from 'class-validator';
import { Priority, Status } from '../entities/task.entity';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsEnum(Priority)
  @IsOptional()
  priority?: Priority;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsArray()
  @IsUUID('all', { each: true })
  @ArrayUnique()
  @IsOptional()
  subtaskIds?: string[];
} 