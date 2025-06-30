import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Status } from '../entities/task.entity';

export class UpdateSubtaskDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
} 