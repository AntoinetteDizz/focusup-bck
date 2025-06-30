import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Status } from '../entities/task.entity';

export class CreateSubtaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
} 