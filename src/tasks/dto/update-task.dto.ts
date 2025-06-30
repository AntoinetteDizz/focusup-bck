import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUUID, IsArray, ArrayUnique } from 'class-validator';
import { Priority, Status } from '../entities/task.entity';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

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