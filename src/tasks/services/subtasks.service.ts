import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subtask, Status, Task, TaskSubtask } from '../entities/task.entity';
import { CreateSubtaskDto } from '../dto/create-subtask.dto';
import { UpdateSubtaskDto } from '../dto/update-subtask.dto';
import { AiService } from './ai.service';

@Injectable()
export class SubtasksService {
  constructor(
    @InjectRepository(Subtask)
    private subtasksRepository: Repository<Subtask>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(TaskSubtask)
    private taskSubtaskRepository: Repository<TaskSubtask>,
    private aiService: AiService,
  ) {}

  async create(createSubtaskDto: CreateSubtaskDto): Promise<Subtask> {
    const subtask = this.subtasksRepository.create(createSubtaskDto);
    return this.subtasksRepository.save(subtask);
  }

  async createWithAI(taskData: { title: string; description: string; priority: string }): Promise<{ title: string; description: string }[]> {
    // Generar subtareas usando IA
    const subtaskTitles = await this.aiService.splitTaskIntoSubtasks(taskData.description);
    // Solo devolver sugerencias, no guardar en la base de datos
    return subtaskTitles.map(title => ({
      title,
      description: `Subtarea generada automáticamente para: ${taskData.title}`
    }));
  }

  async findAll(): Promise<(Subtask & { taskCount: number })[]> {
    const subtasks = await this.subtasksRepository.find({
      order: { createdAt: 'DESC' },
    });
    // Para cada subtarea, contar cuántas tareas la tienen asociada
    const withCount = await Promise.all(subtasks.map(async (subtask) => {
      const count = await this.taskSubtaskRepository.count({ where: { subtaskId: subtask.id } });
      return { ...subtask, taskCount: count };
    }));
    return withCount;
  }

  async findOne(id: string): Promise<Subtask> {
    const subtask = await this.subtasksRepository.findOne({ where: { id } });
    if (!subtask) throw new NotFoundException(`Subtarea con ID ${id} no encontrada`);
    return subtask;
  }

  async update(id: string, updateSubtaskDto: UpdateSubtaskDto): Promise<Subtask> {
    const subtask = await this.findOne(id);
    
    // Validar el estado si se proporciona
    if (updateSubtaskDto.status && !Object.values(Status).includes(updateSubtaskDto.status)) {
      throw new Error(`Estado inválido: ${updateSubtaskDto.status}`);
    }
    
    Object.assign(subtask, updateSubtaskDto);
    return this.subtasksRepository.save(subtask);
  }

  async remove(id: string): Promise<void> {
    const subtask = await this.findOne(id);
    // Verificar si está asociada a alguna tarea
    const relations = await this.taskSubtaskRepository.find({ where: { subtaskId: id } });
    if (relations.length > 0) {
      throw new Error('No puedes eliminar esta subtarea porque está asociada a una tarea. Desasóciala primero.');
    }
    await this.subtasksRepository.remove(subtask);
  }

  async findByStatus(status: Status): Promise<Subtask[]> {
    return this.subtasksRepository.find({
      where: { status },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findAllTasksOfSubtask(subtaskId: string): Promise<Task[]> {
    const relations = await this.taskSubtaskRepository.find({
      where: { subtaskId },
      relations: ['task'],
    });
    return relations.map(rel => rel.task);
  }
} 